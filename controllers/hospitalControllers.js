const Hospital = require("../models/hospitalSchema");
const bloodSample = require("../models/bloodSample");
const bloodRequest = require("../models/bloodRequest");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const generateToken = require("../configuration/tokenGeneration");
const common = require("../utils/common");
const { appConstants } = require("../constants/appConstants");

const hospitalRegistration = async (req, res) => {
  try {
    const { hospital_name, password, hospitalID } = req.body;
    if (!hospitalID || !hospital_name || !password) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
        null
      );
    }
    const hospitalExists = await Hospital.findOne({ hospital_name });
    if (hospitalExists) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.USER_ALREADY_EXISTS,
        null
      );
    }

    const hospital = await Hospital.create({
      hospital_name,
      password,
      hospitalID,
    });
    if (hospital) {
      return common(
        res,
        StatusCodes.CREATED,
        ReasonPhrases.CREATED,
        appConstants.RESPONSE_CREATED_SUCCESS_MSG,
        hospital
      );
    } else {
      return common(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        appConstants.INTERNAL_SERVER_ERROR,
        null
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const authenticateHospital = async (req, res) => {
  try {
    const { hospital_name, password } = req.body;

    if (!hospital_name || !password) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
        null
      );
    }

    const hospital = await Hospital.findOne({ hospital_name });
    if (hospital && hospital.password == password) {
      const data = {
        _id: hospital._id,
        hospital_name: hospital.hospital_name,
        hospitalID: hospital.hospitalID,
        token: generateToken(hospital._id),
      };
      return common(
        res,
        StatusCodes.OK,
        ReasonPhrases.OK,
        appConstants.DATA_FETCHED,
        data
      );
    } else {
      return common(
        res,
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        appConstants.INVALID_CREDS,
        null
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const addBloodSamples = async (req, res) => {
  try {
    const { bloodGroup, amount, hospitalID } = req.body;

    if (!bloodGroup || !amount || !hospitalID) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
        null
      );
    }

    let BloodGroupExist = await bloodSample.findOne({
      hospitalID: hospitalID,
      bloodGroup: bloodGroup,
    });

    if (BloodGroupExist) {
      let updatedSample = await bloodSample.updateOne(
        {
          hospitalID: hospitalID,
          bloodGroup: bloodGroup,
        },
        { $inc: { amount: amount } }
      );
      if (updatedSample) {
        return common(
          res,
          StatusCodes.OK,
          ReasonPhrases.OK,
          appConstants.UPDATION,
          updatedSample
        );
      }
    } else {
      const newBloodSample = await BloodSample.create({
        hospitalID: hospitalID,
        bloodGroup: bloodGroup,
        amount: amount,
      });
      if (newBloodSample) {
        const data = {
          _id: newBloodSample._id,
          hospitalID: newBloodSample.hospitalID,
          bloodGroup: newBloodSample.bloodGroup,
          amount: newBloodSample.amount,
        };
        return common(
          res,
          StatusCodes.CREATED,
          ReasonPhrases.CREATED,
          appConstants.RESPONSE_CREATED_SUCCESS_MSG,
          data
        );
      } else {
        return common(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          appConstants.INTERNAL_SERVER_ERROR,
          null
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const updatedBloodData = async (req, res) => {
  try {
    const { bloodGroup, amount, hospitalID } = req.body;

    if (!bloodGroup || !amount || !hospitalID) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
        null
      );
    }

    let TypeOfBloodExist = await bloodSample.findOne({
      hospitalID: hospitalID,
      bloodGroup: bloodGroup,
    });

    if (amount < 1) {
      let updatedBloodSample = await BloodSample.updateOne(
        {
          hospitalID: hospitalID,
          bloodGroup: bloodGroup,
        },
        { amount: amount }
      );
      if (updatedBloodSample) {
        return common(
          res,
          StatusCodes.OK,
          ReasonPhrases.OK,
          appConstants.UPDATION,
          updatedBloodSample
        );
      }
    }

    if (TypeOfBloodExist) {
      let updatedBloodSample = await bloodSample.updateOne(
        {
          hospitalID: hospitalID,
          bloodGroup: bloodGroup,
        },
        { $inc: { amount: amount } }
      );
      if (updatedBloodSample) {
        return common(
          res,
          StatusCodes.OK,
          ReasonPhrases.OK,
          appConstants.UPDATION,
          updatedBloodSample
        );
      }
    } else {
      return common(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        appConstants.INTERNAL_SERVER_ERROR,
        null
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const removedBloodData = async (req, res) => {
  try {
    const { hospitalID, bloodGroup } = req.body;

    const bloodSample = await bloodSample.findOneAndDelete({
      hospitalID: hospitalID,
      bloodGroup: bloodGroup,
    });

    if (!bloodSample) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.SAMPLE_NOT_FOUND,
        null
      );
    }
    return common(
      res,
      StatusCodes.OK,
      ReasonPhrases.OK,
      appConstants.DATA_FETCHED,
      bloodSample
    );
  } catch (err) {
    console.log(err);
  }
};

const getAllBloodSamples = async (req, res) => {
  try {
    let allBloodSamples = await Hospital.aggregate([
      {
        $lookup: {
          from: "Bloodsamples",
          localField: "_id",
          foreignField: "hospitalID",
          as: "Bloodsamples",
        },
      },
      {
        $project: {
          _id: "$_id",
          name: "$hospital_name",
          bloodSamples: "$Bloodsamples",
        },
      },
    ]);

    if (allBloodSamples) {
      return common(
        res,
        StatusCodes.OK,
        ReasonPhrases.OK,
        appConstants.DATA_FETCHED,
        allBloodSamples
      );
    }

    return common(
      res,
      StatusCodes.UNAUTHORIZED,
      ReasonPhrases.UNAUTHORIZED,
      appConstants.RECORD_NOT_FOUND,
      null
    );
  } catch (err) {
    console.log(err);
  }
};

const getHospitalBloodSamples = async (req, res) => {
    try{
        const { hospitalID } = req.body;
        if (!hospitalID) {
            return common(
                res,
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST,
                appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
                null
              );
        }
      
        const bloodSamples = await bloodSample.find({ hospitalID: hospitalID });
      
        if (!bloodSamples) {
            return common(
                res,
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST,
                appConstants.RECORD_NOT_FOUND,
                null
              );
        }
      
        const hospital = await Hospital.findById(hospitalID);
      
        if (!hospital) {
            return common(
                res,
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST,
                appConstants.RECORD_NOT_FOUND,
                null
              );
        }
      
        const data = {
            hospital_name: hospital.hospital_name,
            bloodSamples,
        }
        return common(
            res,
            StatusCodes.OK,
            ReasonPhrases.OK,
            appConstants.DATA_FETCHED,
            data
          );
    }catch(err){
        console.log(err);
    }
};

const getReceiverRequests = async (req, res) => {
    try{
        const { hospitalID } = req.body;
  
        if (!hospitalID) {
            return common(
                res,
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST,
                appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
                null
              );
        }
      
        let allRequests = await bloodRequest.find({
          hospitalID: hospitalID,
        });
       
        const data = {
            count: allRequests.length,
            hospital_name: allRequests.hospital_name,
            allRequests,
        }
        return common(
            res,
            StatusCodes.CREATED,
            ReasonPhrases.CREATED,
            appConstants.RESPONSE_CREATED_SUCCESS_MSG,
            data
          );
    }catch(err){
        console.log(err);
    }
    
  };

  module.exports = {
    hospitalRegistration,
    authenticateHospital,
    addBloodSamples,
    updatedBloodData,
    removedBloodData,
    getAllBloodSamples,
    getHospitalBloodSamples,
    getReceiverRequests,
  };
