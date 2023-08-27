const express = require("express");
const controller = require("../../controller/admin.controller");


const router = express.Router();
router.route('/login').post(controller.login)
router.route('/signup').post(controller.signup)
router.route('/verifyAdminOtp').post(controller.verifyOtp)
// router.route('/get-card-stats').get(controller.addCoins)


module.exports = router;