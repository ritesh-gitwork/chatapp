const mongoose = require('mongoose')


const DbConnection = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Mongoose Connected: ${conn.connection.host}`)
    }catch(err){
        console.log(`Error: ${err.message}`)
        process.exit()
    }
}

module.exports = DbConnection