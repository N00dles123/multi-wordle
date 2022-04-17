// starts webpage
// for video https://www.youtube.com/watch?v=b91XgdyX-SM&t=570s&ab_channel=codedamn  at 31:08 checking error codes
const express = require("express");
const path = require('path');
const http = require('http');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const { Result } = require("express-validator");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { application } = require('express')
const { resolveAny } = require("dns");
const words = require('./models/Words');


// https://www.youtube.com/watch?v=Ejg7es3ba2k&ab_channel=codedamn
// make sure to install jsonwebtoken and react 
// so that token is not pushed to github
require('dotenv').config();

const word = getRandomWord()
const port = '3001';
const app = express();
app.use(cors());
const uri = process.env.ATLAS_URI;

const JWT_SECRET = process.env.JWT_SECRET;

function getRandomWord(){
    let array = Array.from(words);
    return array[Math.floor(Math.random() * array.length)];
}


// to connect with mongodb
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//app.use(express.static('public'));
app.use(express.json());


//const io = new Server(server, )
// for api for dashboard 
app.get('/api/user', async (req, res) => {
    //console.log(username);
    const token = req.headers['x-access-token'];
    //console.log(token);
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        //console.log(decoded)
        const userN = decoded.username;

        //console.log(userN);

        const user = await User.findOne({uid: userN})
        
        

        return res.json({status: 'ok', user: user.uid, numWins: user.numWins});

    } catch(error) {
        console.log(error)
        return res.json({ status: 'error', error: 'invalid token'})
    }
    


    
});
// for login

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    //console.log(username);

    const user = await User.findOne({uid: username}).lean();
    

    if(!user) {
        return res.json({status: 'error', error: 'Invalid username/password'});
    }
    // if successful password comparison, create a web token for cookie purpose
    if(await bcrypt.compare(password, user.password)){
        //console.log(user.email);
        console.log("success");
        // updates user status to online
        //User.updateOne({uid: username}, {ifOnline: true})
        const token = jwt.sign({email: user.email, username: user.uid, numWins: user.numWins}, JWT_SECRET, {expiresIn: "2h"});
        //await User.findOneAndUpdate({uid: username}, {token: token}, {new: true, upsert: true})
        //console.log(res.json({status: 'ok', data: token}));
       
        
        return res.json({status: 'ok', data: token});
    } else {
        return res.json({ status: 'error', data: false });
    }
});

// for registration to database
app.post('/api/register', async (req, res) => {
    console.log(req.body);

    const {email, uid, pwd, numWins, ifOnline} = req.body;

    if(pwd.length <= 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be at least 6 characters'
        });
    }
    // hash passwords to prevent stealing of data :)
    const password = await bcrypt.hash(pwd, 10);
    //console.log(password);
    try {
        const res = await User.create({
            email,
            uid,
            password,
            numWins,
            ifOnline
        });
        
    } catch(error){
        //console.log(error);
        if(error.code === 11000){
            return res.json({ status: 'error', error: "duplicate username or email is being used"});
        }
        throw error;
        
    }
    res.json({ status: 'ok' });
});

// update info will work on later
/*app.post('/api/user', async(req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const userName = decoded.username;
        const numWins = decoded.numWins;
    } catch(error){
        console.log(error)
        res.json({})
    }

}) */

// for logout 
app.post('/api/logout', async(req, res) => {
    const token = req.headers['x-access-token'];
    if(token == 'null'){
        return res.json({status: 'ok'});
    } else {
        return res.json({ status: 'error', error: "Token was not deleted successfully"})
    }
})

const server = app.listen(port, () => {
    console.log('Server up at 3001');
});

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// create and send word on join room
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    socket.on("join_room", (data) => {
        
        const roomUsers = io.sockets.adapter.rooms.get(data.room);
        var numClients = typeof roomUsers != "undefined" ? roomUsers.size : 0;
        // checks for room size
        // if greater than 1, kick client out
        if(numClients <= 1){
            // userWord will choose the random word for the game
            var userWord = getRandomWord;
            socket.join(data.room);
            //console.log(data.id);
            console.log(`User with ID: ${data.author} joined room: ${data.room}`);
            //socket.in(data).emit("Game start");
            var curStatus = io.sockets.adapter.rooms.get(data.room).size;
            io.to(data.room).emit("game_start", { status: "start", opponent: data.author, word: userWord})
            console.log(curStatus);
        } else {
            io.to(socket.id).emit("room_capacity", { message: "Theres already 2 people in the room!" })
        }
    })
    socket.on("gameStart", (data) => {
        const roomUsers = io.sockets.adapter.rooms.get(data.room);
        console.log(roomUsers.size);
        const roomSize = roomUsers.size
        if(roomSize == 2){
            socket.to(data.room).emit("game_start", { status: "start", opponent: data.author})
            //socket.to(data.room).emit("game_start", { status: "start", opponent: data.author})
        }

    })
    socket.on("toOtherUser", (data) => {
        socket.to(data.room).emit("updateUser", { status: "start", opponent: data.author})
        io.to(data.room).emit("createWord", { userWord: getRandomWord()})
    })
    
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
})



console.log(__dirname);


