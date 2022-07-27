const mongoose = require('mongoose')

// cluster link

const connectDatabase = async () =>{
    mongoose.connect(process.env.CLUS_URL).then((data)=>{
        console.log(`Database is connected to ${data.connection.host}`)
    })
    // .catch((error)=>{
    //     console.log(error) // if solving unhandle promise rejection issue in server.js so dont need to use catch
    // })
}

module.exports = connectDatabase;