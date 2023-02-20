require("dotenv").config() // load .env variables
const express = require("express") // import express
const morgan = require("morgan") //import morgan
const { log } = require("mercedlogger") // import mercedlogger's log function
const cors = require("cors") // import cors
const UserRouter = require("./controllers/Users") //import User Routes
const ProductsRouter = require("./controllers/Products")
const {createContext} = require("./middleware/middleware") 
const passport = require('passport')

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const { PORT = 3000 } = process.env

// Create Application Object
const app = express()

// GLOBAL MIDDLEWARE
app.use(cors()) // add cors headers
app.use(morgan("tiny")) // log the request for debugging
app.use(express.json()) // parse json bodies
app.use(createContext) // create req.context

// THIS IS USED TO CONFIRM THE PERSON WHO IS TRYING TO DO THE REQUEST IS ALLOWED TO, ie: THEY OWN THAT DATA
app.use(passport.initialize())
require("./middleware/passport")(passport)


// ROUTES AND ROUTES
app.get("/", (req, res) => {
    res.send("Backend server is running")
})

app.use("/user", UserRouter) // send all "/user" requests to UserRouter for routing
app.use("/products", ProductsRouter) // send all "/products" request to TodoROuter
app.use('/images', express.static("images"));

// APP LISTENER
app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))