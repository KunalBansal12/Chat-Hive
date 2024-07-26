const mongoose=require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL)

        const connection=mongoose.connection;
        connection.on('connected',()=>{
            console.log('Connected to DB')
        })

        connection.on('error',(err)=>{
            console.log('Something is wrong in connection ',err);
        })


    } catch(err){
        console.log("Something is wrong", err)
    }
}

module.exports=connectDB;