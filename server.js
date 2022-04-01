// starts webpage
// for video https://www.youtube.com/watch?v=b91XgdyX-SM&t=570s&ab_channel=codedamn  at 31:08 checking error codes
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
// so that token is not pushed to github
require('dotenv').config();

const app = express();
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
    console.log(req.body);

    const {email, uid, pwd, numWins} = req.body;
    
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
        console.log(error);
        if(error.code === 11000){
            return res.json({ status: 'error', error: "Username already in use buffoon"});
        }
        
    }

    res.json({ status: 'ok' });
});

console.log(__dirname);
app.listen(9999, () => {
    console.log('Server up at 9999');
});
