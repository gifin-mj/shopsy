
var db=require('../config/connection')
var collection=require('../config/collections')
const promise = require('promise')
const { resolve, reject } = require('promise')
const { PRODUCT_COLLECTION } = require('../config/collections')
const { response } = require('express')
const { ObjectId } = require('mongodb')


module.exports={

    addProduct:(prods)=>{
        return new Promise(async(resolve,reject)=>{
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
    }
    
}