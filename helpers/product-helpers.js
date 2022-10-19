
var db=require('../config/connection')
var collection=require('../config/collections')
const promise = require('promise')
const { resolve, reject } = require('promise')
const { PRODUCT_COLLECTION } = require('../config/collections')
const { response } = require('express')
const { ObjectId } = require('mongodb')
const bcrypt = require("bcrypt");


module.exports={
    adminlogin:(userdata)=>{
        return new promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            let user = await db
              .get()
              .collection(collection.USER_COLLECTION)
              .findOne({ uemail: userdata.email , usertype:'admin' });
            if (user) {
              bcrypt.compare(userdata.password, user.password).then((status) => {
                if (status) {
                  response.user = user;
                  response.loginStatus = status;
                  resolve(response);
                } else resolve({ loginStatus: false });
              });
            } else resolve({ loginStatus: false });
          });
    },

    addProduct:(prods)=>{
        return new Promise(async(resolve,reject)=>{
                prods.price=parseInt(prods.price)
                await db.get().collection(collection.PRODUCT_COLLECTION).insertOne(prods).then((result)=>{
                let lastid=JSON.stringify(result.insertedId)
                resolve(lastid.split('"').join(''))
            
            })
        })
        },/*    
     addProduct:(prods,callback)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(prods).then((result)=>{
            let lastid=JSON.stringify(result.insertedId)
            callback(lastid)
        })
    },*/
    
    viewProduct:()=>{

        return new Promise(async(resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{

        return new promise((resolve,reject)=>{
                
                db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(prodId)}).then((response)=>{
               
                resolve(response)
            })

        })
    },
    viewOne:(prodId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateProduct:(prodId,prods)=>{
        return new promise((resolve,reject)=>{

                db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(prodId)},
                {
                    $set:{
                        'pname':prods.pname,
                        'cat':prods.cat,
                        'price':prods.price,
                        'description':prods.description
                    }
                }).then((response)=>{
                    resolve(response)
                })

        })
    },
    getPlacedOrders:()=>{
        return new promise((resolve,reject)=>{
            let orders=db.get().collection(collection.ORDER_COLLECTION).find({status:'Placed'}).toArray()
            console.log(orders);
            resolve(orders)
        })
        
    },
    updateOrder:(orderId)=>{
        return new promise(async(resolve,reject)=>{
            await db.get().collection(collection.ORDER_COLLECTION).updateOne(
                {
                    _id:ObjectId(orderId)
                },{
                    $set:{
                        shippingstatus:'shipped'
                    }
                }
                ).then((response)=>{
                    resolve(response)
                })
        })
    }
    
}