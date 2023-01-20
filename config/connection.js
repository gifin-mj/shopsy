var mongoclient=require('mongodb').MongoClient

const state={
    db:null
}

module.exports.connect=function(done){
    const url="mongodb://localhost:27017" //"mongodb+srv://gifin:gifin@cluster0.whs3vkt.mongodb.net/?retryWrites=true&w=majority"
    const dbname="shopping"

    mongoclient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
     
}

module.exports.get=function(){
    return state.db
}
