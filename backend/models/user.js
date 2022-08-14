const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Please enter an email address."],
        match: [/.+\@.+\..+/, "Please enter a valid email address."],
        unique: true
    },
    username: {
        type: String,
        trim: true,
        required: [true, "Please enter a username."],
        unique: [true, "This username is already in use."]
    }
});

module.exports = mongoose.model('User', userSchema)