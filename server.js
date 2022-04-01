// starts webpage

const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
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

    // hash passwords to prevent stealing of data

    res.json({ status: 'ok' });
});

console.log(__dirname);
app.listen(9999, () => {
    console.log('Server up at 9999');
});
