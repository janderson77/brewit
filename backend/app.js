const express = require("express");
const app = express();

app.use(express.json());

const morgan = require("morgan");
app.use(morgan("tiny"));

const userRoutes = require("./routes/users")

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
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

module.exports = app;