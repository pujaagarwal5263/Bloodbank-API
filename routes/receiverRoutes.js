const express = require("express");
const {
    receiverRegistration,
    authenticateReceiver,
    requestBloodSample,
} = require("../controllers/receiverControllers");

const router = express.Router();
const { authenticate } = require("../middlewares/authenticate");
const {isReceiver} = require("../middlewares/isReceiver")
const {isHospital} = require("../middlewares/isHospital")

router.post("/",receiverRegistration);
router.post("/login",isReceiver,authenticateReceiver); //isreceiver
router.post("/request-blood-sample",authenticate,isHospital, requestBloodSample); //hospital

module.exports = router;