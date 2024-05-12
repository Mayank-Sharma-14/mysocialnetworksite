const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:'User'
    }],
    comments:[{
        text:String,
        name:String,
        postedby:{type:ObjectId,
        ref:'User'}
    }],
    photo:{
        type:String,
        required:true
    },
    postedby:{
        type:ObjectId,
        ref:'User'
    }
})
const postmodel = mongoose.model('Post',postschema);
module.exports = postmodel