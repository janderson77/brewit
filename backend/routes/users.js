const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')

const User = require("../models/user");
const { validate } = require("jsonschema");

const {userNewSchema, userAuthSchema} = require("../schemas/index");

const createToken = require("../helpers/createToken")

router.post("/register", authMiddleware.register, authMiddleware.signJWTForUser, (req, res, next) => {
    // if(req.body._token) delete req.body._token;

    // const {email, username, password} = req.body;

    // const user = new User({email, username});

    // try{
    //     const newUser = await User.register(user, password);
    //     const token = await createToken(newUser);
    //     const newUserData = {id: newUser._id, _token: token, username};
    //     return res.status(201).json(newUserData);
    // }catch(e){
    //     return next(e)
    // }
});

router.post("/login", async (req, res, next) =>{
    try{
        const isValid = validate(req.body, userAuthSchema);

        if(!isValid.valid){
            return next({
                status: 400,
                message: isValid.errors.map(e => e.stack)
            });
        };

        const user = await User.authenticate(req.body);
        const token = createToken(user);
        user._token = token;

        return res.status(200).json(user)
    }catch(e){
        return next(e)
    }
})

module.exports = router;