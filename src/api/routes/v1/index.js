const express = require("express");
const loginRoute = require("./login.route");
const contestRoute = require('./contest.route')
const adminRoute = require("./admin.route")
const cardRoute = require("./card.route");


const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) =>
  res.json({
    success: true,
    data: {
      message: "Everything is working fine",
    },
  })
);

/**
 * Load client when API with 'resturantId' route parameter is hit
 */
// router.param("resturantId", orderController.setResturantId);@private Depreceated

/**
 * Use middleware
 */
// router.use("/:resturantId/", validate(resturantValidation), orderRoutes);
router.use("/", loginRoute);
router.use("/contest", contestRoute)
router.use("/admin", adminRoute)
router.use("/card", cardRoute);
// router.use("/category", categoryRoutes);
module.exports = router;
