const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Please enter an email address."],
        match: [/.+\@.+\..+/, "Please enter a valid email address."],
        unique: true
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String
    },
    posts: [{type: mongoose.Schema.Types.ObjectId}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)