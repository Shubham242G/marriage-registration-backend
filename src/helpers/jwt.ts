import jwt from "jsonwebtoken";
import { CONFIG } from "@common/config.common";

export const generateAccessJwt = async (obj: object) => {
  return jwt.sign(
    {
      ...obj,
      exp: Math.floor(Date.now() / 1000) + 86400, // valid for 24 hours (was incorrectly set to ~20 years)
    },
    CONFIG.JWTACCESSTOKENSECRET 
  );
};

export const generateRefreshJwt = async (obj: object) => {
  return jwt.sign(
    {
      ...obj,
      exp: Math.floor(Date.now() / 1000) + 604800, //7 days
    },
    CONFIG.JWTACCESSTOKENSECRET 
  );
};
