const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/mycloud615/image/upload/v1714976091/default-avatar-icon-of-social-media-user-vector_urnsea.jpg"
    },
    followers:[{type:ObjectId,
                ref:"User"}],
    following:[{type:ObjectId,
        ref:"User"}]
})
module.exports = mongoose.model('User',userSchema)