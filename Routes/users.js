const express = require('express')
const post = require('../Model/Post');
const usersd = require('../Model/user');
const requireLogin = require('../Middleware/requireLogin');
const userroutes = express.Router();

userroutes.get('/user/:id',requireLogin,async (req,res)=>{
    try {
        const user = await usersd.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        const postdata = await post.find({ postedby: req.params.id }).populate("postedby", "_id name");
        res.json({ user, postdata });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

userroutes.put("/follow",requireLogin,async (req,res)=>{
    try{
        const follow = await usersd.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id}
        },{
            new:true
        })
        if(follow){
            await usersd.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}},{
                    new:true
                }).select("-password").then(result=>{
                    res.json(result)
                }).catch(err=>{
                    return res.status(422).json({error:err})
                })
            }
    }catch(err){
        return res.status(500).json({ error: "Internal server error" });
    }
})

userroutes.put("/unfollow",requireLogin,async (req,res)=>{
    try{
        const follow = await usersd.findByIdAndUpdate(req.body.followId,{
            $pull:{followers:req.user._id}
        },{
            new:true
        })
        if(follow){
            await usersd.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.followId}},{
                    new:true
                }).select("-password").then(result=>{
                    res.json(result)
                }).catch(err=>{
                    return res.status(422).json({error:err})
                })
            }
    }catch(err){
        return res.status(500).json({ error: "Internal server error" });
    }
})




module.exports = userroutes;