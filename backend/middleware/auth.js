const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJwt = require('passport-jwt');
const User = require('../models/user');
const { SECRET } = require("../config");
const { Passport } = require('passport');
const jwtAlgorithm = 'HS256';
const jwtExpiresIn = '7 days';

passport.use(User.createStrategy());

const register = async (req, res, next) => {
    if(req.body.token) delete req.body.token;

    const {email, username, password, first_name, last_name} = req.body;

    const user = new User({email, username, first_name, last_name});

    try{
        const newUser = await User.register(user, password);
        req.user = newUser;
        next();

    }catch(e){
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
        (payload, done) => {
            User.findById(payload.sub)
            .then(user => {
                if(user){
                    done(null, user)
                }else {
                    done(null, false)
                }
            })
            .catch(e => {
                done(e, false)
            });
        }
    )
);

const signJWTForUser = (req, res) => {
    const user = req.user;
    const token = jwt.sign(
        {
            email: user.email
        },
        SECRET,
        {
            algorithm:jwtAlgorithm,
            expiresIn: jwtExpiresIn,
            subject: user._id.toString()
        }
    )
    res.json({token})
};

module.exports = {
    initialize: passport.initialize(),
    register,
    requireJWT: passport.authenticate('jwt', {session: false}),
    signJWTForUser
}