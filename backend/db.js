const mongoose = require('mongoose');
const {DB_URI} = require("./config");

mongoose.connect(DB_URI).then(() => {
    console.log("Connection made on " + DB_URI)
}).catch(err => {
    console.log(err)
});

mongoose.connection.on('error', err => {
    logError(err);
});