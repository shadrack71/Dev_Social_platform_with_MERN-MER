const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Post = require('../models/Post')
const User = require('../models/User')
const Profile  = require('../models/Profile')
const { check , validationResult } = require('express-validator')

// @route POST api/post 
// @desc create post
// access private

router.post('/' ,  [auth,[
    check('text','text required').not().isEmpty() 
]] ,async(req,res) =>{
    const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
            }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const newPost = {
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id    
            } 

            const posts = new Post(newPost)
            await posts.save()
            res.json(posts)
            
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
            
        }

})

// @route GET api/post 
// @desc get all post
// access private

router.get('/', auth ,async(req,res)=>{

    try {
        const posts = await Post.find().sort({date:-1})
        res.json(posts)

        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
        
    }

})


// @route GET api/post/post_id
// @desc get  post by id
// access private

router.get('/:post_id', auth ,async(req,res)=>{

    try {
        const posts = await Post.findById(req.params.post_id)
        if(!posts) return res.status(404).json({msg:'Post not found'})
        res.json(posts)

        
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            res.status(404).json({msg:' Post not found'})
        }
        res.status(500).send('Server Error')
        
    }

})

// @route DELETE api/post/post_id
// @desc delete  post 
// access private

router.delete('/:post_id', auth ,async(req,res)=>{

    try {
        const post = await Post.findById(req.params.post_id)
        if(!post){
            res.status(404).json({msg:' Post not found'})
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:' User not authorized'})
        }
        await post.deleteOne()
        res.json({msg:'Post Removed'})
        
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            res.status(404).json({msg:' Post not found'})
        }
        res.status(500).send('Server Error')
        
    }

})




module.exports = router