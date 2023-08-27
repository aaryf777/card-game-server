const express = require("express");
const controller = require("../../controller/card.controller");
const { verifyAdmin } = require("../../middlewares/auth");


const router = express.Router();
router.route('/addCard').post(verifyAdmin,controller.addCard)
router.route('/insertAllCards').post(verifyAdmin,controller.initializeCards)
router.route('/updateCard').post(verifyAdmin,controller.updateCard)
// router.route('/deleteCard').post(verifyAdmin,controller.deleteCard)
router.route('/getCardData').get(controller.getCards)



module.exports = router;