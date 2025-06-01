const express = require('express')
const router = express.Router() 
const { query ,check , validationResult } = require('express-validator')

// @route Post api/users 
// @desc register user route
// access public

router.post('/' , [
    check('name','Name is required').not().isEmpty() ,
    check('email','Please include a valid email').isEmail() ,
    check('password','please enter a password with 6 or more character').isLength({min:6})
     
],(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    return res.json(req.body)
    //console.log(req.body)

})

router.post('/test' ,[
    query('name','Name is required').not().isEmpty(),
    query('email','Please include a valid email').isEmail(),
    query('password','please enter a password with 6 or more character').isLength({min:6})

],(req,res) =>{
    const errors = validationResult(req)
    if(errors){
        return res.status(200).json({errors:errors.array()})
    }
    console.log(req.body)

})


module.exports = router