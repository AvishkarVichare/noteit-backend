const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = "AviNvoo";
const fecthUser=  require('../middleware/fetchuser')

const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchuser');


// create user route
router.post('/createUser', // username must be an email
body('email','plese enter email not anything else kid').isEmail(),
body('name').isLength({min:3}),
// password must be at least 5 chars long
body('password','password length should not be less than 5').isLength({ min: 5 }), async(req,res)=>{
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
try{
 let user = await User.findOne({email:req.body.email})    //it check wheather it exists already or not
  if(user){
    return res.status(400).json({"msg":"email already exists kid"});
  }

  const salt  = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password,salt);

     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
        
      })
      const data = {
        user:{
        id:user.id   
      }
    }
      const authenticateToken = jwt.sign(data, secret);

      res.json(authenticateToken)
    }
    catch{
      res.status(500).json({"err":"Error occured"})
    }

      // we dont need promises .then because using async await 
      // .then(res.send("hii"))
      // .catch(err=>console.log(err.message))

      

    // console.log(req.body);
    // const user =  User(req.body)
    // user.save();
    // res.send(req.body)
    // console.log("kdjfk")
    // res.send("kdjf");
})



// login user route 
router.post('/login',body('email','please enter email not anythng else').isEmail(),body('password','password could not be empty').exists(),async(req,res)=>{

  const {email,password}= req.body;
  try{
    let user = await User.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json("please check your credentials again");
    }
   const passwordCompare =await bcrypt.compare(password,user.password)
   if(!passwordCompare){
    return res.status(400).json("please check your credentials again");
     
   }

  const data =  {
    user:{
      id:user.id
    }
  }

  const authenticateToken = jwt.sign(data,secret);

  res.json(authenticateToken)

  }catch{
    res.status(500).json({"err":"Error occured"})
    
  }

})



// get users deatails route 

router.post('/getuser',fetchUser,async(req,res)=>{
  try {

    const userid = await req.user.id;
    const user = await User.findById(userid).select("-password");

    res.send(user)

  } catch (error) {
    res.status(500).json({"err":"Error occured"})
    
  }
 
  
})

module.exports = router;