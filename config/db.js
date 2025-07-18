const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI')

const connectDB = async () =>{

    try {
        await mongoose.connect(db,{
            useNewUrlparser:true,
            
            
        })
        console.log('MongoDB Connected...')
        
    }catch(err){
        console.error(err.message)
        // exiting process with error
        process.exit(1)


    }
   
}
module.exports = connectDB