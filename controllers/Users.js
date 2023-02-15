require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const { userAuth, serializeUser, checkRole, isLoggedIn } = require("../middleware/middleware");

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
    const { User } = req.context.models; // We can deconstruct the model like this since we wrote a middleware for this just nice to have i guess
    try {
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);
        // create a new user
        const user = await User.create(req.body);
        // send new user as response
        res.json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
});

// TODO: THIS ENDPOINT NEEDS TO BE REMOVED WHEN THE SITE BECOMES PUBLIC. IE: ANY IP ADDRESS CAN HIT THE SEVER THIS ENDPOINT MUST NOT BE HERE WHEN SITE GOES PUBLIC
// IT WILL NEED TO EXIST ON PRODUCTION FOR ATLEAST SOMETIME SO OWNER CAN CREATE A ADMIN ACCOUNT OF HIS LIKING.
// IF NOT THIS CAN GIVE PEOPLE A WINDOW OF OPPORTUNITY TO REGISTER ADMIN ACCOUNTS!!!!!

// Signup route to create a new user admin
router.post("/signup-admin", async (req, res) => {
    const { User } = req.context.models; // We can deconstruct the model like this since we wrote a middleware for this
    try {
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.role = "admin";
        // create a new user
        const user = await User.create(req.body);
        // send new user as response
        res.json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
    const { User } = req.context.models;
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            //check if password matches
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                // sign token and send it in response
                const token = await jwt.sign({ username: user.username, id: user._id }, SECRET, { expiresIn: "1 days" });
                const role = user.role;
                res.json({ token, role });
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/profile", isLoggedIn, userAuth, checkRole(["user"]), async (req, res) => {
    return res.json(serializeUser(req.user))
})
module.exports = router;