const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Please enter an email address"],
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
        unique: true
    }
})