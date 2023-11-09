require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const { userAuth, serializeUser, checkRole, isLoggedIn } = require("../middleware/middleware");
const { SECRET = "secret" } = process.env;

const router = Router(); 

// Signup route to create a new user
router.post("/signup", async (req, res) => {
    const { User } = req.context.models;
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create(req.body);
        res.json(serializeUser(user));
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Signup route to create a new user admin
router.post("/signup-admin", async (req, res) => {
    const { User } = req.context.models;
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.role = "admin";
        const user = await User.create(req.body);
        res.json(serializeUser(user));
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.post("/login", async (req, res) => {
    const { User } = req.context.models;
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
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