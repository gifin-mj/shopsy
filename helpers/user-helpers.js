var db=require('../config/connection')
var collection=require('../config/collections')
const promise = require('promise')
const { resolve, reject } = require('promise')
const bcrypt=require('bcrypt')

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
                    console.log("success");
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
        

    }
}