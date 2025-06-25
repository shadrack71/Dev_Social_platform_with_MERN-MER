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


module.exports = router