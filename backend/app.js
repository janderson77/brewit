// if(process.env.NODE_ENV !== "production"){
//     require("dotenv").config();
// };
const express = require("express");
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRoutes = require("./routes/users")
const { DB_URI } = require('./config')

mongoose.connect(DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.json());

const secret = process.env.SECRET || "thisisasecretdonttellanyone"

const morgan = require("morgan");
app.use(morgan("tiny"));

app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));

app.use('/users', userRoutes)

// 404 handler
app.use(function (req, res, next){
    const err = new Error("Not Found");
    err.status = 404;

    return next(err)
})

// General Error Handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

module.exports = app;