const express = require('express')
const request = require('request')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const Profile  = require('../models/Profile')
const config = require('config')
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

// @route GET api/profile
// @desc  get all profile
// access public

router.get('/', async(req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar'])
        res.json(profiles)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


// @route GET api/profile/user/:user_id
// @desc  get  profile by user id
// access public

router.get('/user/:user_id', async(req,res)=>{
    try {
        const profile = await Profile.findOne({ user :req.params.user_id}).populate('user',['name','avatar'])
        if(!profile) return res.status(400).json({msg:'There is no profile for this user'})

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            res.status(400).json({msg:' no profile found'})
        }
        res.status(500).send('Server error')
    }
})

// @route DELETE api/profile
// @desc  DELETE  profile profile , user & post
// access private

router.delete('/',auth , async(req,res)=>{
    try {
        //remove profile 
        // @todo remove user pist
        await Profile.findOneAndDelete({ user :req.user.id})
        await User.findOneAndDelete({ _id :req.user.id})
        
        res.json({msg:'user delete'})
        
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            res.status(400).json({msg:' no profile found'})
        }
        res.status(500).send('Server error')
    }
})


// @route PUT api/profile/experience
// @desc  add  profile experience ,
// access private

router.put('/experience',[auth,[
    check('title','title is  required').not().isEmpty() ,
    check('company','company is required').not().isEmpty(),
    check('from','from date is  required').not().isEmpty(),
]], async(req,res)=>{
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const { 
            company,
            title,
            from,
            location,
            to,
            current,
            description 
        } = req.body

    const newExp = {
        title,
        company,
        from,
        location,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:req.user.id})
        if(!profile) return res.json({msg:'profile not found'})
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)

    } catch (err) {

        console.error(err.message)
        res.status(500).send('Server error')
        
    }

})


// @route DELETE api/experience/exp_id
// @desc  DELETE  experience
// access private

router.delete('/experience/:exp_id',auth , async(req,res)=>{
    try {
        //remove bexperience 
        
        const profile = await Profile.findOne({user:req.user.id})
        const removeIndex = profile.experience.map(item =>item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex,1)
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            res.status(400).json({msg:' no profile found'})
        }
        res.status(500).send('Server error')
    }
})



// @route PUT api/profile/education
// @desc  add  profile education ,
// access private

router.put('/education',[auth,[
    check('school','school is  required').not().isEmpty() ,
    check('degree','degree is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
    check('from','from date is  required').not().isEmpty(),
]], async(req,res)=>{
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const { 
            school,
            degree,
            from,
            fieldofstudy,
            to,
            current,
            description
            
        } = req.body

    const newEdu = {
        school,
        degree,
        from,
        fieldofstudy,
        to,
        current,
        description
    };
    try {
        const profile = await Profile.findOne({user:req.user.id})
        if(!profile) return res.json({msg:'profile not found'})
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)

    } catch (err) {

        console.error(err.message)
        res.status(500).send('Server error')
        
    }

})

// @route DELETE api/education/edu_id
// @desc  DELETE  education
// access private

router.delete('/education/:exp_id',auth , async(req,res)=>{
    try {
        //remove bexperience 
        
        const profile = await Profile.findOne({user:req.user.id})
        const removeIndex = profile.education.map(item =>item.id).indexOf(req.params.edu_id)
        profile.experience.splice(removeIndex,1)
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
           return  res.status(400).json({msg:' no profile found'})
        }
        res.status(500).send('Server error')
    }
})
// @route GET api/profile/github/:username
// @desc  get user repos from github
// access public


router.get('/github/:username', async(req,res) => {

    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}

        }
        request(options,(error,response,body)=>{
            if(error)console.error(error)
            if(response.statusCode !==200){
                res.status(400).json({msg:'Github profile not found'})
            }
            res.json(JSON.parse(body))
        })
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
        
    }


})
module.exports = router