const express = require("express");
const {
    hospitalRegistration,
    authenticateHospital,
    addBloodSamples,
    updatedBloodData,
    removedBloodData,
    getAllBloodSamples,
    getHospitalBloodSamples,
    getReceiverRequests,
} = require("../controllers/hospitalControllers");
const { authenticate } = require("../middlewares/authenticate");
const {isReceiver} = require("../middlewares/isReceiver")
const {isHospital} = require("../middlewares/isHospital")
const router = express.Router();

router.post("/",hospitalRegistration);
router.post("login",authenticateHospital);
router.post("/add-blood-info",authenticate, isHospital, addBloodSamples); //only hospitals
router.put("/update-blood-info",authenticate, isHospital,updatedBloodData); //only hospitals
router.put("/remove-blood-info",authenticate,isHospital, removedBloodData);  //only hospitals
router.get("/blood-samples-info", isReceiver,getAllBloodSamples);  //only receivers
router.get("/hospital-blood-samples",authenticate,isHospital, getHospitalBloodSamples);  //only hospitals
router.get("/receiver-requests",authenticate,isHospital, getReceiverRequests); //only hospitals

module.exports = router;