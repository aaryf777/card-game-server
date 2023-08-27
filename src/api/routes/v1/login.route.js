const express = require("express");
const controller = require("../../controller/login.controller");
const { verifyJwt } = require("../../middlewares/auth");


const router = express.Router();


router.route('/login').post(controller.login)

router.route('/signup').post(controller.signup)

router.route('/verifyOtp').post(controller.verifyOtp)
router.route('/addCoin').post(verifyJwt,controller.addCoins)
router.route('/getcontestTypes').get(controller.getContestTypes);
router.route('/profile').get(verifyJwt,controller.getProfile)
router.route('/update-profile').post(verifyJwt,controller.updateProfile)

module.exports = router;