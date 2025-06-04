const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const Profile  = require('../models/Profile')
const {check , validationResult } = require('express-validator')

// @route GET api/profile/me
// @desc  Get current users profile
// access privite

router.get('/me' , auth,  async (req,res) =>{

    try{
        const profile = await Profile.findOne({ user: req.user.id}).populate('user',['name','avatar'])
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})

        }
        res.json(profile)

    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')

    }
})

// @route POST api/profile
// @desc  Create or update  user profile
// access privite

router.post('/', [auth,[
    check('status','status required').not().isEmpty() ,
    check('skills','skills required').not().isEmpty()
]],async(res , req) =>{
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const { email , pass} = req.body

})


module.exports = router