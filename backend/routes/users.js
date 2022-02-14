const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { validate } = require("jsonschema");

const {userNewSchema} = require("../schemas/index");

const createToken = require("../helpers/createToken")

router.post("/register", async function(req, res, next){
    try{
        if(req.body._token){
            delete req.body._token
        }
        const isValid = validate(req.body, userNewSchema);

        if(!isValid.valid){
            return next({
                status: 400,
                message: isValid.errors.map(e => e.stack)
            });
        };

        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        newUser[0]._token = token;
        return res.status(201).json(newUser[0]);
    }catch(e){
        return next(e)
    }
});

module.exports = router;