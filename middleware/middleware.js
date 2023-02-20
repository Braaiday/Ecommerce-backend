require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const passport = require("passport");



// CREATE CONTEXT MIDDLEWARE
const createContext = (req, res, next) => {
    // put any data you want in the object below to be accessible to all routes
    req.context = {
        models: {
            User,
            Product,
        },
    };
    next();
};

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
    try {
        // check if auth header exists
        if (req.headers.authorization) {
            // parse token from header
            const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
            if (token) {
                const payload = await jwt.verify(token, process.env.SECRET);
                if (payload) {
                    // store user data in request object
                    req.user = payload;
                    next();
                } else {
                    res.status(400).json({ error: "token verification failed" });
                }
            } else {
                res.status(400).json({ error: "malformed auth header" });
            }
        } else {
            res.status(400).json({ error: "No authorization header" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

const serializeUser = user => {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

// Does the person who is requesting the data own the data, this is what this is doing for us
const userAuth = passport.authenticate("jwt", { session: false });

// Role authorization to limit certain roles from hitting endpoints they should not
const checkRole = roles => (req, res, next) => {
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();
}

// export custom middleware
module.exports = {
    isLoggedIn, // used to see if they have a token at all
    userAuth, // checks to see if they own the data
    checkRole, // confirms the role of the logged in user and if they allowed to use this endpoint
    createContext,
    serializeUser
};