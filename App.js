const express = require('express')
const app = express();
const mongoose = require('mongoose')
const routes = require('./Routes/authen');
const postroutes = require('./Routes/postR');
const userroutes = require('./Routes/users')

const {MONGOURI} = require("./config/valuekey.js")

const PORT = process.env.PORT || 9000
mongoose.connect(MONGOURI)
mongoose.connection.on("connected", ()=>{
    console.log("We are connected to server")
})
mongoose.connection.on("error", ()=>{
    console.log("We are not connected to server")
})


app.use(express.json())
app.use(routes)
app.use(postroutes)
app.use(userroutes)


if(process.env.NODE_ENV =="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,()=>{
    console.log("Server started...")
})