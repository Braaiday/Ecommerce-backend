const { Router } = require("express"); // import Router from express
const { isLoggedIn, userAuth, checkRole } = require("../middleware/middleware"); // import isLoggedIn custom middleware

const router = Router();

//custom middleware could also be set at the router level like so
// router.use(isLoggedIn) then all routes in this router would be protected

// Index Route with isLoggedIn middleware
router.get("/", async (req, res) => {
  return res.json("Not yet implemented");
});

// Show Route with isLoggedIn middleware
router.get("/:id", async (req, res) => {
  return res.json("Not yet implemented");
});

// create Route with isLoggedIn middleware
router.post("/", isLoggedIn, checkRole, async (req, res) => {
  return res.json("Not yet implemented");
});

// update Route with isLoggedIn middleware
router.put("/:id", isLoggedIn, checkRole, async (req, res) => {
  return res.json("Not yet implemented");
});

// update Route with isLoggedIn middleware
router.delete("/:id", isLoggedIn, checkRole, async (req, res) => {
  return res.json("Not yet implemented");
});

module.exports = router