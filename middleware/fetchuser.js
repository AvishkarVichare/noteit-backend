// we are using middleware because if we want to use it in some other route then we dont have to write code again we can use this 

// it wil give us id of user because while creating token we have used it id 

const jwt = require('jsonwebtoken');
const secret = "AviNvoo";

const fetchUser = (req,res,next)=>{
    // Get user from jwt token and add user id to req object 
    const token = req.header('auth-token');
try{


    if(!token){
        res.status(401).json("please access with valid token")
    }

    const userIdData = jwt.verify(token,secret);
console.log(userIdData)
    req.user = userIdData.user;
    next();
    
    }
    catch{
        res.json(400)
    }

}


module.exports = fetchUser;