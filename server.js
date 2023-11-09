require("dotenv").config();
const express = require("express") ;
const morgan = require("morgan") ;
const cors = require("cors") ;
const UserRouter = require("./controllers/Users") ;
const ProductsRouter = require("./controllers/Products");
const passport = require('passport');
const { log } = require("mercedlogger") ;
const { createContext } = require("./middleware/middleware");

const { PORT = 5000 } = process.env;
const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(createContext);
app.use(passport.initialize())
require("./middleware/passport")(passport)

app.get("/",
    (req, res) => res.send("Backend server is running")
);

app.use("/user", UserRouter);
app.use("/products", ProductsRouter);
app.use('/images', express.static("images"));

app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`));