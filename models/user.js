const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongooose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongooose);

module.exports = mongoose.model('User', UserSchema);