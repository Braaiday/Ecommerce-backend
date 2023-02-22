const { Router, json } = require("express"); // import Router from express
const { isLoggedIn, userAuth, checkRole } = require("../middleware/middleware"); // import isLoggedIn custom middleware
const path = require('path');
const router = Router();
const multer = require('multer');

// Local storage for image uploading 
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
});
var upload = multer({ storage: storage });


// Index Route with isLoggedIn middleware
router.get("/", async (req, res) => {
  const { Product } = req.context.models;
  try {
    let products = await Product.find();
    res.json(products);
  } catch (err) {
    res.json(err)
  }
});

// Show Route with isLoggedIn middleware
router.get("/:id", async (req, res) => {
  const { Product } = req.context.models;
  try {
    let products = await Product.find();
    res.json(products);
  } catch (err) {
    res.json(err)
  }
});

// create Route with isLoggedIn middleware
router.post("/", isLoggedIn, userAuth, checkRole(["admin"]), async (req, res) => {
  console.log(req.body);
  const url = req.protocol + '://' + req.get('host')
  const { Product } = req.context.models;

  try {
    if (!req.body.imgUrl) {
      req.body.imgUrl = url + '/images/' + 'no_image.png';
    }
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// update Route with isLoggedIn middleware
router.put("/:id", isLoggedIn, userAuth, checkRole(["admin"]), async (req, res) => {
  const { Product } = req.context.models;
  return res.json("Not yet implemented");
});

// update Route with isLoggedIn middleware
router.delete("/:id", isLoggedIn, userAuth, checkRole(["admin"]), async (req, res) => {
  const { Product } = req.context.models;
  return res.json("Not yet implemented");
});

router.post("/uploadimage", isLoggedIn, userAuth, checkRole(["admin"]), upload.single('image'), async (req, res) => {
  try {
    res.json(req.file)

  } catch (err) {
    res.json(err)
  }
});

module.exports = router