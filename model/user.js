const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
    email: { type: String, required: true, unique: true},
    uid: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    numWins: { type: String, required: true}
    },
    { collection: 'users'}
);

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;