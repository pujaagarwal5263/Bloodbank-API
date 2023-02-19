const Hospital = require("../models/hospitalSchema");
const Receiver = require("../models/receiverSchema");
const bloodSample = require("../models/bloodSample");
const bloodRequest = require("../models/bloodRequest");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const generateToken = require("../configuration/tokenGeneration");
const common = require("../utils/common");
const { appConstants } = require("../constants/appConstants");

const receiverRegistration = async (req, res) => {
  try {
    const { receiverName, password, bloodGroup } = req.body;

    if (!receiverName || !password || !bloodGroup) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
        null
      );
    }

    const receiverExists = await Receiver.findOne({ receiverName });

    if (receiverExists) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.USER_ALREADY_EXISTS,
        null
      );
    }

    const receiver = await Receiver.create({
      receiverName,
      password,
      bloodType,
    });

    if (receiver) {
      return common(
        res,
        StatusCodes.CREATED,
        ReasonPhrases.CREATED,
        appConstants.RESPONSE_CREATED_SUCCESS_MSG,
        receiver
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

const authenticateReceiver = async (req, res) => {
  try {
    const { receiverName, password } = req.body;

    const receiver = await Receiver.findOne({ receiverName });
    if (receiver && receiver.password == password) {
      const data = {
        _id: receiver._id,
        name: receiver.receiverName,
        bloodType: receiver.bloodType,
        token: generateToken(receiver._id),
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

const requestBloodSample = async (req, res) => {
  try {
    const { receiverId, hospitalID, bloodGroup, amount } = req.body;

    if (!receiverId || !hospitalID || !bloodGroup || !amount) {
      return common(
        res,
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        appConstants.RESPONSE_REQUIRED_FIELD_ERROR_MSG,
        null
      );
    }

    let hospitalExist = await Hospital.findOne({ _id: hospitalID });
    if (!hospitalExist) {
      return common(
        res,
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        appConstants.RECORD_NOT_FOUND,
        null
      );
    }

    let receiverExists = Receiver.findById({ _id: receiverId });
    if (!receiverExists) {
      return common(
        res,
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        appConstants.RECORD_NOT_FOUND,
        null
      );
    }

    let RequestExist = await bloodRequest.findOne({
      hospitalID: hospitalID,
      receiverId: receiverId,
    });

    if (RequestExist) {
      return common(
        res,
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN,
        appConstants.REQUEST_ALREADY_MADE,
        null
      );
    }

    let request = await bloodRequest.create({
      receiverId,
      hospitalID,
      bloodGroup,
      amount,
    });

    if (request) {
      return common(
        res,
        StatusCodes.CREATED,
        ReasonPhrases.CREATED,
        appConstants.RESPONSE_CREATED_SUCCESS_MSG,
        request
      );
    }
    return common(
      res,
      StatusCodes.UNAUTHORIZED,
      ReasonPhrases.UNAUTHORIZED,
      appConstants.FAILED,
      null
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  receiverRegistration,
  authenticateReceiver,
  requestBloodSample,
};
