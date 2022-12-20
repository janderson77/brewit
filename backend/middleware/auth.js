const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJwt = require('passport-jwt');
const User = require('../models/user');
const { SECRET } = require("../config");
const jwtAlgorithm = 'HS256';
const jwtExpiresIn = '7 days';

passport.use(User.createStrategy());

const isLoggedIn = (req, res, next) => {
    if (!req.body.token) {
        return next({
            status: 400,
            message: "You must be logged in to do that."
        });
    };

    next();
};

const ensureCorrectUser = async (req, res, next) => {
    const { id } = req.params
    if (!req.body.token) {
        return next({
            status: 400,
            message: "You must be logged in to do that."
        });
    };

    try {
        let token = jwt.verify(req.body.token, SECRET)
        req.username = token.username

        const user = await User.findById(id)
        if (token.username === user.username) {
            delete user.hash
            delete user.salt
            req.user = user
            return next();
        };

        throw new Error();
    } catch (e) {
        const unauthorized = new Error("You are not authorized.");
        unauthorized.status = 401;
        return next(unauthorized)
    };

};

const register = async (req, res, next) => {
    if (req.body.token) delete req.body.token;

    const { email, username, password, first_name, last_name } = req.body;

    const dupCheck = await User.findOne({ email });

    if (dupCheck) {
        const duplicateError = new Error("This email is already in use");
        return next(duplicateError);
    }

    const user = new User({ email, username, first_name, last_name });

    try {
        const newUser = await User.register(user, password);
        req.user = newUser;
        res.statusCode = 201;
        next();

    } catch (e) {
        console.log(e)
        return next(e)
    }

};

passport.use(
    new passportJwt.Strategy(
        {
            jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRET,
            algorithms: [jwtAlgorithm]
        },
        (payload, done) => { }
    )
);

const signJWTForUser = (req, res) => {
    const user = req.user;
    const token = jwt.sign(
        {
            email: user.email,
            username: user.username
        },
        SECRET,
        {
            algorithm: jwtAlgorithm,
            expiresIn: jwtExpiresIn,
            subject: user._id.toString()
        }
    )
    delete req.user._doc.hash
    delete req.user._doc.salt
    res.json({ ...req.user._doc, token })
};

module.exports = {
    initialize: passport.initialize(),
    register,
    requireJWT: passport.authenticate('jwt', { session: false }),
    signJWTForUser,
    isLoggedIn,
    ensureCorrectUser
}