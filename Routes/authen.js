const express = require('express')
const User = require('../Model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../Middleware/requireLogin')
const routes = express.Router()

const JWT_SECRET = "qwertabcdehas"

routes.post('/signup',(req,res)=>{
    try{
        const {name,email,password,pic}= req.body
        if(!email||!password||!name){
            res.send({error:"you will need to give all the information"})
        }
        User.findOne({email:email}).then((saveUser=>{
            if(saveUser){
                return res.send({error:"User already exists with the emial id"})
            }
            bcrypt.hash(password,12).then(hashedpassword=>{
                const user = new User({
                    name,email,password:hashedpassword,pic
                })
                user.save().then(user=>{
                    res.send({message:"saved successfully"})
                }).catch(err=>{
                    console.log(err)
                })
            })
        })).catch(err=>{
            console.log(err)
        })
    }
    catch(err){
        console.log(err)
    }
})

routes.post('/protected',requireLogin,(req,res)=>{
    res.send("heeloo")
})

routes.post('/signin',(req,res)=>{
    try{
        const {email,password}= req.body
        if(!email||!password){
            res.send({error:"Please add Email or Password"})
        }
        User.findOne({email:email}).then((saveUser=>{
            if(!saveUser){
                return res.send({error:"Invalid Email or Password"})
            }
            bcrypt.compare(password,saveUser.password)
            .then(match=>{
                if(match){
                    // res.send({message:"Successfully Signed in"})
                    const token = jwt.sign({_id:saveUser._id},JWT_SECRET)
                    const {_id,name,email,followers,following,pic} = saveUser
                    res.send({token, user:{_id,name,email,followers,following,pic}})
                    // res.send(token)
                }
                else{
                    return res.send({error:"Invalid Email or Password"})
                }
            })
        })).catch(err=>{
            console.log(err)
        })
    }
    catch(err){
        console.log(err)
    }

})



module.exports = routes