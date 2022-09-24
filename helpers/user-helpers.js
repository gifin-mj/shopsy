var db=require('../config/connection')
var collection=require('../config/collections')
const promise = require('promise')
const { resolve, reject } = require('promise')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
const { CART_COLLECTION, PRODUCT_COLLECTION } = require('../config/collections')
const { response } = require('express')
const collections = require('../config/collections')

module.exports={
    signup:(userdata)=>{
            return new Promise(async(resolve,reject)=>{
                    userdata.password= await bcrypt.hash(userdata.password,10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then(()=>{
                    resolve(true) 
                })
                
            })
    },
    login:(userdata)=>{

        return new promise(async(resolve,reject)=>{

            let loginStatus=false
            let response={}
            let user= await db.get().collection(collection.USER_COLLECTION).findOne({uemail:userdata.email})
           if (user){
            bcrypt.compare(userdata.password,user.password).then((status)=>{
                if(status){
                   
                    response.user=user
                    response.loginStatus=status
                    resolve(response)
                }
                else 
                resolve({loginStatus:false})
            })
           }
           else
           resolve({loginStatus:false})
           
        })
        

    },
    addtocart:(userId,prod)=>{
        prodId=prod.prodId
        prodObj={
            item:ObjectId(prodId),
            quantity:1,
        }
        return new promise((resolve,reject)=>{
            let usercart = db.get().collection(collection.CART_COLLECTION).findOne({userId:ObjectId(userId)}).then((usercart)=>{
                   if(usercart == null){
                        cart={
                            userId:ObjectId(userId),
                            products:[prodObj]
                        }
                        db.get().collection(collection.CART_COLLECTION).insertOne(cart).then((response)=>{
                            resolve(response)
                        })
                    }
                    else{
                        
                        let proexit=usercart.products.findIndex(product => product.item == prodId)
                        
                        if(proexit != -1){
                            
                            db.get().collection(collection.CART_COLLECTION).updateOne({userId:ObjectId(userId),'products.item':ObjectId(prodId)},
                            {
                                $inc:{
                                    'products.$.quantity':1,
                                },
                            }).then(()=>{
                                resolve()
                            })

                        }
                        else{
                           db.get().collection(collection.CART_COLLECTION).updateOne({userId:ObjectId(userId)},
                            {
                                $push:{products:prodObj}
                            }).then((response)=>{
                                console.log(response);
                                resolve(response)
                            })
                        }
                        
                       
                    }
                })
        })
    },
    viewCart:(userId)=>{

        return new promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{userId:ObjectId(userId)}
                },{
                    $unwind:'$products'
                },{
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },{
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },{
                    $project:{
                        item:1,quantity:1,
                        product:{$arrayElemAt:['$product',0]},
                    },
                }
               
            ]).toArray()
            console.log(cartItems);
           
            resolve(cartItems )
        })
    },
    getCartcount:(userid)=>{
        return new promise(async(resolve,reject)=>{
        let count=0
        let cart= await db.get().collection(collection.CART_COLLECTION).findOne({userId:ObjectId(userid)})
        
        if(cart){
            count=cart.products.length
        }
            resolve(count)
        })
    },
changeproductQuantity:(details)=>{
       let count=parseInt(details.count)
        return new promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).updateOne({_id:ObjectId(details.cart),'products.item':ObjectId(details.product)},
            {
                $inc:{
                    'products.$.quantity':count
                }
            }).then((response)=>{
                
                resolve(response)
            })
        })

    },
    deletecartProduct:(userId,prodId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).updateOne({userId:ObjectId(userId)},
            {
                $pull:{
                    products:{item:ObjectId(prodId)}
                },
            }).then(()=>{
                resolve(true)
            })
        })
    },
    getTotalAmount:(userId)=>{
        return new promise(async(resolve,reject)=>{
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{userId:ObjectId(userId)}
                },{
                    $unwind:'$products'
                },{
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },{
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },{
                    $project:{
                        item:1,quantity:1,
                        product:{$arrayElemAt:['$product',0]},
                    },
                },{
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$product.price']}}
                    }
                }
               
            ]).toArray()           
            resolve(total[0].total)
        })
    },
    getCartproductList:(userId)=>{
        return new promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collections.CART_COLLECTION).findOne({userId:ObjectId(userId)})
            resolve(cart.products)
        })
    },
    placeOrder:(order,products,total)=>{
        let status = order['payment-method'] === 'COD' ? "Placed" : "Pending"
        let orderobj={
            userId:ObjectId(order.userId),
            delivery:{
                address:order.address,
                pincode:order.pincode,
                mobile:order.mobile
            },
            products:products,
            totalamount:total,
            paymentmethod:order['payment-method'],
            orderdate:new Date(),
            status:status
        }
        return new promise((resolve,reject)=>{
           
            //  console.log(order,products,total);
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderobj).then(()=>{
                db.get().collection(collection.CART_COLLECTION).deleteOne({userId:ObjectId(order.userId)})
                resolve()
            })

        })
    }
}