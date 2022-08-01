var db=require('../config/connection')
var collection=require('../config/collections')
const promise = require('promise')
const { resolve, reject } = require('promise')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
const { CART_COLLECTION } = require('../config/collections')
const { response } = require('express')

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
    addtocart:(userId,prodId)=>{
        
        return new promise((resolve,reject)=>{
            let usercart = db.get().collection(collection.CART_COLLECTION).findOne({userId:ObjectId(userId)}).then((usercart)=>{
                   if(usercart == null){
                        cart={
                            userId:ObjectId(userId),
                            products:[ObjectId(prodId)]
                        }
                        db.get().collection(collection.CART_COLLECTION).insertOne(cart).then((response)=>{
                            resolve(response)
                        })
                    }
                    else{
                        
                        db.get().collection(collection.CART_COLLECTION).updateOne({userId:ObjectId(userId)},
                        {
                            $push:{products:ObjectId(prodId)}
                        }).then((response)=>{
                            console.log(response);
                            resolve(response)
                        })
                       
                    }
                })
        })
    }
}