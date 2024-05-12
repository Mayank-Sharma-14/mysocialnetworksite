const jwt = require("jsonwebtoken")
const JWT_SECRET = "qwertabcdehas"
const mongoose = require('mongoose')
const user = mongoose.model('User')
module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        res.status(401).send({error:'you must be logged in'})
    }
    const token = authorization.replace("Bearer","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).send({error:"you must be logged in or token is incorrect"})
        }
        const {_id} = payload
        user.findById(_id).then(userdata=>{
            req.user= userdata
            next()
        })

    })

}