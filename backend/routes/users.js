const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { validate } = require("jsonschema");

const {userNewSchema} = require("../schemas/index");

router.post("/register", async function(req, res, next){
    
})