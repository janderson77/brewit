const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const passport = require("passport");
const { isLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

router.post("/register", authMiddleware.register, authMiddleware.signJWTForUser, (req, res, next) => {});

router.post("/login", passport.authenticate('local', {session: false}), authMiddleware.signJWTForUser, (req, res, next) =>{})

router.get('/:id/edit', isLoggedIn, authMiddleware.ensureCorrectUser, async (req, res, next) => { return res.json({...req.User._doc}) });

router.put('/:id', authMiddleware.ensureCorrectUser, async (req, res, next) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    return res.json(updatedUser)
});

module.exports = router;