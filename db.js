const mongoose=require('mongoose');

//const mongooseUrl='mongodb://localhost:27017/voting'
const mongooseUrl='mongodb+srv://salmanahmed7866:salman7866@cluster0.x67s60h.mongodb.net/'

mongoose.connect(mongooseUrl);

const db=mongoose.connection;

db.on('connected',()=>{

    console.log('Connected to mongo db server');

})

db.on('error',(err)=>{
        console.log('Mongo db connection error:',err);
        

})

db.on('disconnected',()=>{
        console.log('Mongo db Disconnected');

})


module.exports=db;