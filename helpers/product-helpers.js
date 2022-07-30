
var db=require('../config/connection')
var collection=require('../config/collections')
const promise = require('promise')

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
    }
}