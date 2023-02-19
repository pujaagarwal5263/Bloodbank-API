const common = require("../utils/common")
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { appConstants } = require("../constants/appConstants");

export const isReceiver = (req, res, next) => {
    if (req.user.role !== "receiver") {
      return common(res, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, appConstants.UNAUTHORIZED, null)
    }
    next();
  };
  