const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const passport = require("passport");
const { isLoggedIn } = require("../middleware/auth");

router.post("/register", authMiddleware.register, authMiddleware.signJWTForUser, (req, res, next) => {
});

router.post("/login", passport.authenticate('local', {session: false}), authMiddleware.signJWTForUser, (req, res, next) =>{})

router.get('/:id/edit', isLoggedIn, authMiddleware.ensureCorrectUser, async (req, res, next) => { return res.json({...req.user._doc}) });

module.exports = router;