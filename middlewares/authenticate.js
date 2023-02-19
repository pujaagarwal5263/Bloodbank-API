const jwt = require("jsonwebtoken");
const Receiver = require("../models/receiverSchema");
const Hospital = require("../models/hospitalSchema")
const common = require("../utils/common")
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { appConstants } = require("../constants/appConstants");

const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let userFound = await Receiver.findById(decoded.id);
      if(!userFound){
        userFound = await Hospital.findById(decoded.id);
      }
      req.user = userFound;
      next();
    } catch (error) {
      return common(res, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, appConstants.TOKEN_NOT_FOUND, null)
    }
  }
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
    return common(res, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, appConstants.TOKEN_NOT_FOUND, null)
  }
};

module.exports = { authenticate };