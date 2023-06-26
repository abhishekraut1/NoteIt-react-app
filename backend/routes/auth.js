const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'rautabhi$01'

// Route 1: Create a User using POST "/api/auth/createuser" No login required
router.post('/createuser', [
    body('name', 'Enter a valid name.').isLength({ min: 3 }),
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Enter atleast 5 characters.').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with same email already exists.
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({success, error:'Sorry a user with this email is already exits.'})
        }

        const salt = await bcrypt.genSalt(10);
        securePass = await bcrypt.hash(req.body.password,salt);
        // Create a new User
        user = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email
        })

        const data = {
            user : {
                id : user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        success = true;

        res.json({success, authtoken});
    }
    catch(error){
        res.status(500).send(success, "Some error occured.")
    }
})

// Route 2: Authenticate a User using POST "/api/auth/login" No login required
router.post('/login', [
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password cannot be blank.').exists()
], async (req, res) => {
    let success = false;
    // If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    const {email , password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error:'Please try to login with correct credentials.'})
        }
        const passwordCompare = await bcrypt.compare(password,user.password);

        if(!passwordCompare){
            return res.status(400).json({success, error:'Please try to login with correct credentials.'})
        }

        const data = {
            user : {
                id : user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success, authtoken});    
    }
    catch(error){
        console.error(error.message);
        res.status(500).send(success, "Internal server error.")
    }
})

// Route 3: Get loggedin User Details using POST "/api/auth/getuser" login required
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId).select('-password');
        res.send(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error.")
    }
})


module.exports = router