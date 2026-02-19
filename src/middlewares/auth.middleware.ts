import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@models/user.model";
import { CONFIG } from "@common/config.common";

export const authorizeJwt: RequestHandler = async (req: any, res, next) => {
  req.user = undefined;
  const authorization = req.headers["authorization"];

  // Removed console.log of authorization token for security
  let token = authorization && authorization.split("Bearer ")[1];
  if (!token && typeof req.query.token == "string") {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  try {
    // FIX: Use synchronous verify to prevent race condition
    // Previously next() was called outside the callback, causing auth bypass
    const decoded: any = jwt.verify(token, CONFIG.JWTACCESSTOKENSECRET);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    
    req.user = decoded;
    if (decoded.userId) {
      req.user.userId = decoded.userId;
      req.user.userObj = await User.findById(decoded.userId).exec();
    }
    
    next();
  } catch (e) {
    console.error("Token verification failed");
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export const setUserAndUserObj: RequestHandler = async (req, res, next) => {
  // console.log(req.headers);

  const authorization = req.headers["authorization"];
  let token = authorization && authorization.split("Bearer ")[1];
  if (!token && typeof req.query.token == "string") {
    token = req.query.token;
  }
  if (token) {
    try {
      // Verify token
      const decoded: any = jwt.verify(token, CONFIG.JWTACCESSTOKENSECRET);
      // Add user from payload
      if (decoded) {
        req.user = decoded;
      }

      if (req.user) {
        req.user.userObj = await User.findById(decoded.userId).exec();
      }
    } catch (e) {
      console.error(e);
      // return res.status(401).json({ message: "Invalid Token" });
    }
  }
  next();
};
