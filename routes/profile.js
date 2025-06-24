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
]],async(req,res) =>{
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const { 
            company,
            website,
            location,
            status,
            skills,
            instagram,
            linkedin,
            facebook,
            twitter,
            youtube,
            bio,
            githubusername
        } = req.body
    const profileFields = {}
    profileFields.user = req.user.id
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    // profileFields.social = {};
    // if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    // if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    // if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    // if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    // if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    // if(company) profileFields.company = company
    
    try{
        let profile = await Profile.findOne({ user:req.user.id })
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            )
            return res.json(profile)

        }
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)

    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }

})


module.exports = router