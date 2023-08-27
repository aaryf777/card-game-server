const express = require("express");
const controller = require("../../controller/contest.controller");

const { verifyJwt } = require("../../middlewares/auth");

const router = express.Router();

// router.route('/start-game').post(verifyJwt,controller.startGame)

router.route('/contest-users').get(controller.getContestUsers)
router.route('/getcontests').get(controller.getContests);


// router.route('/activeContests').get(verifyJwt,controller.activeContests)

module.exports = router;