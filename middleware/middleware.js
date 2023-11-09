require("dotenv").config(); // loading env variables
const User = require("../models/User");
const Product = require("../models/Product");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const createContext = (req, res, next) => {
    req.context = {
        models: {
            User,
            Product,
        },
    };
    next();
};

const isLoggedIn = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                const payload = await jwt.verify(token, process.env.SECRET);
                if (payload) {
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

const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = roles => (req, res, next) => {
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();
}

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

module.exports = {
    isLoggedIn, // Validates there is a token
    userAuth, // Ensure the data belongs to the user
    checkRole, // Checks if the user role associated with token is valid
    createContext, // Provides better intellisense on data coming back from mongo db
    serializeUser
};