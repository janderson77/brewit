const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const passport = require("passport");

router.post("/register", authMiddleware.register, authMiddleware.signJWTForUser, (req, res, next) => {
});

router.post("/login", passport.authenticate('local', {session: false}), authMiddleware.signJWTForUser, (req, res, next) =>{})

module.exports = router;