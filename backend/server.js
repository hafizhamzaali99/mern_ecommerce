const app = require('./app');
const express = require('express');
const dotenv = require('dotenv').config();
const connectDatabase = require('./config/database')
// const {connectDatabase} = require('./config/database.js');

// const PORT = require('./config/config.env')

//connecting Db
connectDatabase()

// listening app
app.listen(process.env.PORT || 4000 , ()=>{
    console.log(`Server is working on Port: ${process.env.PORT}`)
})