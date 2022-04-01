// starts webpage

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

    const {email, uid, pwd} = req.body;
    
    // hash passwords to prevent stealing of data :)
    const password = await bcrypt.hash(pwd, 10);
    console.log(password);
    try {
        const res = await User.create({
            email,
            uid,
            password
        });
        console.log("User created Successfully" , res);
    } catch(error){
        console.log(error);
        return res.json({ status: 'error'});
    }

    res.json({ status: 'ok' });
});

console.log(__dirname);
app.listen(9999, () => {
    console.log('Server up at 9999');
});
