const mongoose = require('mongoose')

// cluster link

const connectDatabase = async () =>{
    mongoose.connect(process.env.LOC_URL).then((data)=>{
        console.log(`Database is connected to ${data.connection.host}`)
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports = connectDatabase