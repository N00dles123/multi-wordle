// starts webpage
// for video https://www.youtube.com/watch?v=b91XgdyX-SM&t=570s&ab_channel=codedamn  at 31:08 checking error codes
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const { Result } = require("express-validator");
const jwt = require("jsonwebtoken");

// so that token is not pushed to github
require('dotenv').config();

const port = '9999';
const app = express();
const uri = process.env.ATLAS_URI;

const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(username);
    const user = await User.findOne({uid: username}).lean();
    console.log(user.email);

    if(!user) {
        return res.json({status: 'error', error: 'Invalid username/password'});
    }

    if(await bcrypt.compare(password, user.password)){
        // success!
        const token = jwt.sign({email: user.email, username: user.uid}, JWT_SECRET);
        //console.log(res.json({status: 'ok', data: token}));
        return res.json({status: 'ok', data: token});
    }


    res.json({ status: 'error', error: 'Invalid username/password'});
});

app.post('/api/register', async (req, res) => {
    console.log(req.body);

    const {email, uid, pwd, numWins} = req.body;

    if(pwd.length <= 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be at least 6 characters'
        });
    }
    // hash passwords to prevent stealing of data :)
    const password = await bcrypt.hash(pwd, 10);
    console.log(password);
    try {
        const res = await User.create({
            email,
            uid,
            password,
            numWins
        });
        console.log("User created Successfully" , res);
    } catch(error){
        //console.log(error);
        if(error.code === 11000){
            return res.json({ status: 'error', error: "Username already in use buffoon"});
        }
        throw error;
        
    }
    res.json({ status: 'ok' });
});

console.log(__dirname);
app.listen(port, () => {
    console.log('Server up at 9999');
});
