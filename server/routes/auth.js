const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');


const JWT_SECRET = "Harryisagoodb$oy";
// ROUTE 1 : Create a User using: POST "/api/auth/createuser".No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // Finds the error from a submitted form
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    // Check whether a user with the same email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this eamil already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        // Create a new User
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // res.json(user)
        success=true;
        res.json({success, authtoken });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Some error occurred");
    }
})

// ROUTE 2 : Authenticate a User using : Post "/api/auth/login".No login requiered
router.post('/login', [
    
    body('email', 'Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req, res) => {
   
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const{email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({msg:"Invalid credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false;
            return res.status(400).json({success,msg:'Invalid Credentials'})
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authtoken });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server error");
    }

});


// ROUTE 3 : Get loggedin User Details using : POST "/api/auth/getuser". Login required
router.post('/getuser',fetchuser,  async (req, res) => {
   
try {
    userId =req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
}
})

module.exports = router