const express = require('express')
const post = require('../Model/Post');
const requireLogin = require('../Middleware/requireLogin');
const postroutes = express.Router();

postroutes.get('/mypost', requireLogin, (req, res) => {
    post.find({ postedby: req.user._id })
        .populate("postedby", "_id name")
        .then(mypost => {
            res.send(mypost)
        }).catch(err => {
            console.log(err)
        })
})

postroutes.get('/allpost', requireLogin, (req, res) => {
    post.find()
        .populate("postedby", "_id name")
        .then(posts => {
            res.send(posts)
        }).catch(err => {
            console.log(err)
        })
})

postroutes.get('/getsubpost', requireLogin, (req, res) => {
    post.find({postedby:{$in:req.user.following}})
        .populate("postedby", "_id name")
        .then(posts => {
            res.send(posts)
        }).catch(err => {
            console.log(err)
        })
})

postroutes.post('/createPost', requireLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        return res.status(422).send({ error: 'please add all of the fields' })
        // return res.status(422).send({error:photo})
    }
    req.user.password = undefined
    const posts = new post({
        title,
        body,
        photo: photo,
        postedby: req.user

    })
    posts.save().then(result => {
        res.send({ post: result })
    }).catch(err => {
        console.log(err)
    })
})

postroutes.put("/like", requireLogin, async (req, res) => {
    try {
        const result = await post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.user._id } }, { new: true });
        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

postroutes.put("/unlike", requireLogin, async (req, res) => {
    try {
        const result = await post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.user._id } }, { new: true });
        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

postroutes.put("/comment", requireLogin, async (req, res) => {
    try {
        const comment = {
            text:req.body.text,
            name:req.body.name,
            postedby:req.user
        }
        const result = await post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment} }, { new: true }).populate("postedby","_id name").populate("comments.postedby","_id name");
        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

postroutes.delete('/deletepost/:postId', requireLogin, async (req,res)=>{
    try {
        const result = await post.findOne({ _id: req.params.postId }).populate("postedby", "_id");
        if (!result) {
            return res.status(422).json({ error: "There is no post" });
        }
        if (result.postedby._id.toString() === req.user._id.toString()) {
            await post.deleteOne({ _id: req.params.postId });
            res.json({ message: "Post deleted successfully" });
            }
            else{
                console.error("Error while removing post:", err);
                return res.status(401).json({ error: "You are not authorized to delete this post" });
            }
    } catch (err) {
        console.error("Error while finding post:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = postroutes;