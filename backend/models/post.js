const mongoose = require('mongoose');
const {Schema} = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['mead', 'beer', 'wine', 'other'],
        lowercase: true,
        required: true
    },
    author: {
        Type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredients: [{
        Type: String
    }],
    postBody: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Post', postSchema);