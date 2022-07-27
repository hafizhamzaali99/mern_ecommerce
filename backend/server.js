const app = require('./app');
const express = require('express');
const dotenv = require('dotenv').config();
const connectDatabase = require('./config/database')
// const {connectDatabase} = require('./config/database.js');

// const PORT = require('./config/config.env')

// handle uncaught exception

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Server is down due to uncaught exception `)
    process.exit(1)
})

//connecting Db
connectDatabase()

// listening app
const server = app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server is working on Port: ${process.env.PORT}`)
})

// unhandle promise rejection

process.on('unhandledRejection',(err)=>{
    console.log(`error ${err.message}`)
    console.log(`Server is down due to unhandle promise rejection `)
    server.close(()=>{
        process.exit(1)
    })
})