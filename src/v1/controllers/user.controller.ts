import { comparePassword, encryptPassword } from "@helpers/bcrypt";
import { generateAccessJwt, generateRefreshJwt } from "@helpers/jwt";
import { User } from "@models/user.model";
import { Request, Response, NextFunction } from "express";
import { addLogs } from "@helpers/addLog";
import mongoose, { PipelineStage } from "mongoose";
import { DEPARTMENT, ROLES } from "@common/constant.common";
import { OTP } from "@models/otp.model";
import jwt from "jsonwebtoken";
import { MySubscription } from "@models/mySubscription.model";
import { UserSubscription } from "@models/userSubscription.model";
import {
  checkDateHourDifference,
  generateRandomNum,
} from "@helpers/generators";
import { CONFIG } from "@common/config.common";
import {
  contactQueryTemplate,
  documentRejectionAndReUpload,
  documentSumittedSuccessfully,
  forgetPasswordTemplate,
  planBuy,
  successfullDocumentVerification,
  welcomeEmail,
} from "../../util/emailTemplate";
import { SendBrevoMail } from "../service/brevoMail.service";
import { sendSMS } from "../../util/twilliosms";
import { paginateAggregate } from "@helpers/paginateAggregate";
import { Document } from "@models/document.model";
import { Payment } from "@models/payment.model";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const UserExistCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`),
      role: "ADMIN",
      isDeleted: false,
    }).exec();

    if (!UserExistCheck) {
      throw new Error(`User Does Not Exist`);
    }

    if (UserExistCheck.password) {
      const passwordCheck = await comparePassword(
        UserExistCheck.password,
        req.body.password
      );

      if (!passwordCheck) {
        throw new Error(`Invalid Credentials`);
      }
    }

    const token = await generateAccessJwt({
      userId: UserExistCheck._id,
      role: UserExistCheck.role,
      department: UserExistCheck.department,
      user: {
        name: UserExistCheck.name,
        email: UserExistCheck.email,
        phone: UserExistCheck.phone,
        _id: UserExistCheck._id,
        accessObj: UserExistCheck.accessObj,
      },
    });
    let refreshToken = await generateRefreshJwt({
      userId: UserExistCheck._id,
      role: ROLES.USER,
      name: UserExistCheck.name,
      department: UserExistCheck.department,
      phone: UserExistCheck.phone,
      email: UserExistCheck.email,
    });
    addLogs("Login", UserExistCheck.name, UserExistCheck.email);
    res.status(200).json({
      message: "User Logged In",
      token,
      refreshToken,
      user: {
        name: UserExistCheck.name,
        email: UserExistCheck.email,
        phone: UserExistCheck.phone,
        role: UserExistCheck.role,
        department: UserExistCheck.department,
        _id: UserExistCheck._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
      role: "ADMIN",
      isDeleted: false,
    }).exec();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash the password
    const hashedPassword = await encryptPassword(req.body.password);

    // Create new admin user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      role: "ADMIN",
      department: req.body.department,
      accessObj: req.body.accessObj || {},
    });

    // Generate tokens
    const token = await generateAccessJwt({
      userId: newUser._id,
      role: newUser.role,
      department: newUser.department,
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        _id: newUser._id,
        accessObj: newUser.accessObj,
      },
    });

    const refreshToken = await generateRefreshJwt({
      userId: newUser._id,
      role: newUser.role,
      name: newUser.name,
      department: newUser.department,
      phone: newUser.phone,
      email: newUser.email,
    });

    addLogs("Admin Registration", newUser.name, newUser.email);

    res.status(201).json({
      message: "Admin user created successfully",
      token,
      refreshToken,
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department,
        _id: newUser._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, name, email, phone, department, accessObj, password } =
      req.body;

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Find the user to update
    const user = await User.findById(userId).exec();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        email: new RegExp(`^${email}$`, "i"),
        _id: { $ne: userId },
        isDeleted: false,
      }).exec();

      if (emailExists) {
        throw new Error("Email already in use by another user");
      }
    }

    // Build update object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (department) updateData.department = department;
    if (accessObj) updateData.accessObj = accessObj;

    // Hash password if provided
    if (password) {
      updateData.password = await encryptPassword(password);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // addLogs("User Update", req?.user?.name, `Updated user: ${updatedUser.email}`);

    res.status(200).json({
      message: "User updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        department: updatedUser.department,
        _id: updatedUser._id,
        accessObj: updatedUser.accessObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];

    // Always filter for ADMIN role only
    pipeline.push({
      $match: { role: "ADMIN" },
    });

    // Handle search query
    const queryStr = String(req.query.search || "").trim();
    if (queryStr) {
      const regex = new RegExp(queryStr, "i");
      pipeline.push({
        $match: {
          $or: [{ name: regex }, { email: regex }, { phone: regex }],
        },
      });
    }

    // Exclude password field
    pipeline.push({
      $project: {
        password: 0,
      },
    });

    // Sort by createdAt descending
    pipeline.push({
      $sort: { createdAt: -1 },
    });

    let userArr = await paginateAggregate(User, pipeline, req.query);

    res.status(200).json({
      message: "Users fetched successfully",
      data: userArr.data,
      total: userArr.total,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const UserExistCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`),
      isDeleted: false,
    }).exec();

    if (!UserExistCheck) {
      return res.status(404).json({ message: "User Does Not Exist" });
    }

    if (UserExistCheck.password) {
      const passwordCheck = await comparePassword(
        UserExistCheck.password,
        req.body.password
      );

      if (!passwordCheck) {
        throw new Error(`Invalid Credentials`);
      }
    }

    const token = await generateAccessJwt({
      userId: UserExistCheck._id,
      role: UserExistCheck.role,
      department: UserExistCheck.department,
      user: {
        name: UserExistCheck.name,
        email: UserExistCheck.email,
        phone: UserExistCheck.phone,
        _id: UserExistCheck._id,
        accessObj: UserExistCheck.accessObj,
      },
    });
    let refreshToken = await generateRefreshJwt({
      userId: UserExistCheck._id,
      role: ROLES.USER,
      name: UserExistCheck.name,
      department: UserExistCheck.department,
      phone: UserExistCheck.phone,
      email: UserExistCheck.email,
    });
    addLogs("Login", UserExistCheck.name, UserExistCheck.email);
    res.status(200).json({
      message: "User Logged In",
      token,
      refreshToken,
      user: {
        name: UserExistCheck.name,
        email: UserExistCheck.email,
        phone: UserExistCheck.phone,
        role: UserExistCheck.role,
        department: UserExistCheck.department,
        _id: UserExistCheck._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body?.email) {
      throw { status: 401, message: "Email is require" };
    }
    const userObj = await User.findOne({
      email: new RegExp(`^${req.body.email}$`),
    })
      .lean()
      .exec();
    if (!userObj) {
      throw { status: 401, message: "user Not Found" };
    }

    // if (!verifyRefreshTokenJwt(req.body.email, req.body.refresh)) {
    //   throw { status: 401, message: "Refresh Token is not matched" };
    // }

    let accessToken = await generateAccessJwt({
      userId: userObj._id,
      role: ROLES.USER,
      name: userObj.name,
      department: userObj.department,
      phone: userObj.phone,
      email: userObj.email,
    });
    let refreshToken = await generateRefreshJwt({
      userId: userObj._id,
      role: ROLES.USER,
      name: userObj.name,
      department: userObj.department,
      phone: userObj.phone,
      email: userObj.email,
    });
    res.status(200).json({
      message: "Refresh Token",
      token: accessToken,
      refreshToken,
      user: {
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        role: userObj.role,
        department: userObj.department,
        _id: userObj._id,
      },
      success: true,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const registerUserWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const UserExistEmailCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
      isDeleted: false,
    }).exec();

    if (UserExistEmailCheck) {
      throw new Error(`User with this email Already Exists`);
    }

    const UserExistPhoneCheck = await User.findOne({
      phone: req.body.phone,
      isDeleted: false,
    }).exec();
    if (UserExistPhoneCheck) {
      throw new Error(`User with this phone Already Exists`);
    }

    // if (req.body.userName && req.body.userName != "") {
    //   const UserExistUserNameCheck = await User.findOne({
    //     userName: new RegExp(`^${req.body.userName}$`, "i"),
    //   }).exec();

    //   if (UserExistUserNameCheck) {
    //     throw new Error(`User with this username already exists`);
    //   }
    // }

    req.body.password = await encryptPassword(req.body.password);

    const user = await new User({ ...req.body }).save();

    const html = await welcomeEmail(req.body.name, req.body.email);

    console.log("check working");

    try {
      const BrevoRes = await SendBrevoMail(
        "Welcome to Marriage Registration",
        [
          {
            name: req?.body?.name,
            email: req?.body?.email,
          },
        ],
        html
      );

      console.log(BrevoRes, "BrevoRes");
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({
      message:
        (req.body.role && req.body.role != ""
          ? `${req.body.role}`.toLowerCase()
          : "User") + " Created",
      data: user._id,
    });
  } catch (error) {
    // Stale username_1 index fires after successful insert — treat as success
    const err = error as any
    if (err?.code === 11000 && err?.keyPattern?.username) {
      return res.status(201).json({
        message: "user Created",
        data: null,
      });
    }
    next(error);
  
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const UserExistNameCheck = await User.findOne({
      name: new RegExp(`^${req.body.name}$`, "i"),
    }).exec();

    if (UserExistNameCheck) {
      throw new Error(`User with this name Already Exists`);
    }
    const UserExistEmailCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
    }).exec();

    if (UserExistEmailCheck) {
      throw new Error(`User with this email Already Exists`);
    }

    // const UserExistPhoneCheck = await User.findOne({
    //   phone: req.body.phone,
    // }).exec();
    // if (UserExistPhoneCheck) {
    //   throw new Error(`User with this phone Already Exists`);
    // }

    if (req.body.userName && req.body.userName != "") {
      const UserExistUserNameCheck = await User.findOne({
        userName: new RegExp(`^${req.body.userName}$`, "i"),
      }).exec();

      if (UserExistUserNameCheck) {
        throw new Error(`User with this username already exists`);
      }
    }

    req.body.password = await encryptPassword(req.body.password);

    const user = await new User({ ...req.body }).save();

    res.status(201).json({
      message:
        (req.body.role && req.body.role != ""
          ? `${req.body.role}`.toLowerCase()
          : "User") + " Created",
      data: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const registerUserWithPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const UserExistPhoneCheck = await User.findOne({
    phone: req.body.phone,
    isDeleted: false,
  }).exec();

  if (UserExistPhoneCheck) {
    return res
      .status(404)
      .json({ message: "User with this phone Already Exist" });
  }
  const { phone } = req.body;

  if (!phone) {
    return res.status(404).json({ message: "Mobile number is required" });
  }

  try {
    // Save OTP to the database

    const otpcheck = await OTP.findOne({ phone }).lean();
    // SECURITY FIX: Always use random OTP, never derive from phone number
  const otp = generateOTP();
    console.log(otpcheck);
    if (!otpcheck) {
      const Otp = await OTP.create({ phone, otp });
    } else {
      throw new Error(`OTP already Sent successfully`);
    }

    // // Send OTP via Twilio
    // await client.messages.create({
    //   body: `Your OTP is: ${otp}`,
    //   from: 'your_twilio_phone_number',
    //   to: mobileNumber,
    // });
    console.log(otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
};

export const loginUserWithPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userExistCheck = await User.findOne({
    phone: new RegExp(`^${req.body.phone}$`),
    isDeleted: false,
  }).exec();

  if (!userExistCheck) {
    return res.status(404).json({ message: "User Does Not Exist" });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Mobile number is required" });
  }

  // SECURITY FIX: Always use random OTP, never derive from phone number
  const otp = generateOTP();
  const message = "checking message is working otp is " + otp;

  // const sent = await sendSMS(`+91${phone}`, message);
  //  const html = await planBuy(

  //         );

  //         await SendBrevoMail(
  //           "Document Verified Successfully",
  //           [
  //             {
  //               name: "test",
  //                email:"vinay.kumar@ebslon.com",
  //             },
  //           ],
  //           html
  //         );

  //          const html2 = await  documentSumittedSuccessfully(

  //         );

  //         await SendBrevoMail(
  //           "Document Verified Successfully",
  //           [
  //             {
  //               name: "test",
  //               email:"vinay.kumar@ebslon.com",
  //             },
  //           ],
  //           html2
  //         );

  //         const html3 = await  successfullDocumentVerification( "dfihsoifhsf"

  //         );

  //         await SendBrevoMail(
  //           "Document Verified Successfully",
  //           [
  //             {
  //               name: "test",
  //               email:"vinay.kumar@ebslon.com",
  //             },
  //           ],
  //           html3
  //         );

  //         const html4 = await  documentRejectionAndReUpload(
  //             "dfihsoifhsf", "dfihsoifhsf"
  //         )

  //         await SendBrevoMail(
  //           "Document Verified Successfully",
  //           [
  //             {
  //               name: "test",
  //               email:"vinay.kumar@ebslon.com",
  //             },
  //           ],
  //           html4
  //         );

  //          const html5 = await  contactQueryTemplate(
  //             "dfihsoifhsf", "dfihsoifhsf" , "dsfisfhlis", "difsjil"
  //         )

  //         await SendBrevoMail(
  //           "Document Verified Successfully",
  //           [
  //             {
  //               name: "test",
  //                email:"vinay.kumar@ebslon.com",
  //             },
  //           ],
  //           html5
  //         );

  try {
    const otpcheck = await OTP.findOne({
      phone: new RegExp(`^${phone}$`),
    }).exec();

    if (!otpcheck) {
      await OTP.create({ phone, otp });
    } else {
      return res.json({ message: "OTP already sent successfully" });
    }

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phone, otp, isRegister } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" });
  }

  try {
    // Find the OTP in the database
    const otpRecord = await OTP.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Delete the OTP after successful verification
    console.log(isRegister, "isRegister check");
    await OTP.deleteOne({ phone, otp });
    if (isRegister) {
      // Registration flow
      // Check if user already exists
      const existingUser = await User.findOne({
        phone: phone,
        isDeleted: false,
      }).exec();
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists with this phone" });
      }
      const userObj = await new User({ ...req.body }).save();
      return res.status(201).json({
        message: "Registered Successfully",
        data: userObj._id,
      });
    } else {
      // Login flow
      const userObj = await User.findOne({ phone, isDeleted: false }).exec();
      if (!userObj) {
        return res.status(404).json({ error: "User does not exist" });
      }
      let accessToken = await generateAccessJwt({
        userId: userObj._id,
        role: userObj.role,
        name: userObj.name,
        department: userObj.department,
        phone: userObj.phone,
        email: userObj.email,
      });
      let refreshToken = await generateRefreshJwt({
        userId: userObj._id,
        role: userObj.role,
        name: userObj.name,
        department: userObj.department,
        phone: userObj.phone,
        email: userObj.email,
      });
      return res.status(200).json({
        message: "Refresh Token",
        token: accessToken,
        refreshToken,
        user: {
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
          role: userObj.role,
          department: userObj.department,
          _id: userObj._id,
        },
        success: true,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const verifyOtpForRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" });
  }

  try {
    // Find the OTP in the database
    const otpRecord = await OTP.findOne({ phone, otp });

    console.log(otpRecord, "check otpREcord");

    if (otpRecord) {
      // Delete the OTP after successful verification

      await OTP.deleteOne({ phone, otp });
      const user = await new User({ ...req.body }).save();

      // const html = await planBuy();

      // await SendBrevoMail(
      //   "Plan Buy",
      //   [
      //     {
      //       name: req?.body?.name,
      //       email: req?.body?.email,
      //     },
      //   ],
      //   html
      // );

      res.status(201).json({
        message:
          (req.body.role && req.body.role != ""
            ? `${req.body.role}`.toLowerCase()
            : "User") + " Created",
        data: user._id,
      });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

// export const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { token, newPassword } = req.body;

//     // Verify the reset token
//     const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
//     if (!decoded) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     // Find user
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update password
//     user.password = await encryptPassword(newPassword);
//     await user.save();

//     res.status(200).json({ message: "Password successfully updated" });
//   } catch (error) {
//     next(error);
//   }
// };

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("check working");
  try {
    if (!req.body?.email) {
      throw new Error(`Email is required`);
    }
    const UserExistEmailCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
    }).exec();

    console.log(UserExistEmailCheck, "UserExistEmailCheck");

    if (!UserExistEmailCheck) {
      throw new Error(`User with this email not Exists`);
    }

    const id = generateRandomNum();
    const token = await encryptPassword(id);

    const url = `${CONFIG.APP_URL}/reset-password?email=${UserExistEmailCheck.email}&token=${token}`;
    console.log(url, "check url for forget password");

    let usersObj = await User.findByIdAndUpdate(UserExistEmailCheck._id, {
      password_reset_token: token,
      token_send_at: new Date().toISOString(),
    }).exec();

    console.log(UserExistEmailCheck, "UserExistEmailCheck");

    console.log(
      UserExistEmailCheck,
      "UserExistEmailCheck",
      UserExistEmailCheck.name,
      "UserExistEmailCheck.name",
      UserExistEmailCheck.email,
      "UserExistEmailCheck.email"
    );
    if (
      UserExistEmailCheck &&
      UserExistEmailCheck.name &&
      UserExistEmailCheck.email
    ) {
      console.log(UserExistEmailCheck, "check log for brevo email ");
      const html = await forgetPasswordTemplate(url, UserExistEmailCheck.name);

      await SendBrevoMail(
        "Forgot Password",
        [
          {
            name: UserExistEmailCheck.name,
            email: UserExistEmailCheck.email,
          },
        ],
        html
      );
    }

    res.status(200).json({
      message: "Email sent successfully!! please check your email",
      success: true,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    if (!req.body?.email) {
      throw new Error(`Email is required`);
    }
    if (!req.body?.password) {
      throw new Error(`Password is required`);
    }
    const UserExistEmailCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
    }).exec();
    if (!UserExistEmailCheck) {
      throw new Error(`User with this email not Exists`);
    }

    if (req.body?.token !== UserExistEmailCheck.password_reset_token) {
      throw new Error(`Please make sure you are using correct url.`);
    }

    const hoursDiff = checkDateHourDifference(
      UserExistEmailCheck.token_send_at
    );
    if (hoursDiff > 2) {
      throw new Error(
        `Password Reset token got expire.please send new token to reset password.`
      );
    }

    req.body.password = await encryptPassword(req.body.password);
    let usersObj = await User.findByIdAndUpdate(UserExistEmailCheck._id, {
      password: req.body.password,
    }).exec();
    res.status(200).json({
      message: "Password reset successfully! please try to login now.",
      success: true,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const mySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user?.userId) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const user = await User.findOne({
      _id: req?.user?.userId,
      isDeleted: false,
    }).exec();

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    let mySubcriptionObj = await MySubscription.findOne({
      userId: req?.user?.userId,
      isDeleted: false,
    })
      .lean()
      .exec();
    let subscriptionObj = await UserSubscription.findOne({
      _id: mySubcriptionObj?.subscriptionId,
    })
      .lean()
      .exec();

    console.log(mySubcriptionObj, "mySubcriptionObj");

    if (!subscriptionObj) {
      return res.status(200).json({
        message: "Subscription not found",
        data: { message: "Subscription not found" },
      });
    }

    return res.status(200).json({
      message: "Subscription Details",
      data: { ...mySubcriptionObj, subscriptionObj },
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const UserExistNameCheck = await User.findOne({
      name: new RegExp(`^${req.body.name}$`, "i"),
    }).exec();

    if (UserExistNameCheck) {
      throw new Error(`User with this name Already Exists`);
    }
    const UserExistEmailCheck = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
    }).exec();
    if (UserExistEmailCheck) {
      throw new Error(`User with this email Already Exists`);
    }

    const UserExistPhoneCheck = await User.findOne({
      phone: req.body.phone,
    }).exec();
    if (UserExistPhoneCheck) {
      throw new Error(`User with this phone Already Exists`);
    }

    if (req.body.userName && req.body.userName != "") {
      const UserExistUserNameCheck = await User.findOne({
        userName: new RegExp(`^${req.body.userName}$`, "i"),
      }).exec();

      if (UserExistUserNameCheck) {
        throw new Error(`User with this username already exists`);
      }
    }

    req.body.password = await encryptPassword(req.body.password);

    const user = await new User({ ...req.body }).save();

    res.status(201).json({ message: "Registered", data: user._id });
  } catch (error) {
    next(error);
  }
};

export const addUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user?.userId).exec();

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const userDetails = await User.findByIdAndUpdate(req.user?.userId, {
    name: req.body.name,
    email: req.body.email,
  }).exec();
  res.status(201).json({ message: "User Updated" });
};

export const updateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req?.params?.id).exec();

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const emailExist = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.params.id },
    isDeleted: false,
  }).exec();
  if (emailExist) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const phoneExist = await User.findOne({
    phone: req.body.phone,
    _id: { $ne: req.params.id },
    isDeleted: false,
  }).exec();
  if (phoneExist) {
    return res.status(400).json({ message: "Phone already exists" });
  }

  const userDetails = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  }).exec();
  res.status(201).json({ message: "User Updated" });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById({
    _id: req.user?.userId,
  }).exec();

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const userDetails = await User.findOne({
    _id: req.user?.userId,
  }).exec();
  console.log(userDetails, "userDetails");
  res.status(201).json({ message: "User Updated", data: userDetails });
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteByUser = await User.findById(req.params.userId).exec();

    console.log(deleteByUser, "deleteByUser");

    if (!deleteByUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isDocumentExists = await Document.findOne({
      userId: req?.params?.userId,
      isDeleted: false,
    }).exec();

    // if (deleteByUser?.role === "ADMIN") {

    if (isDocumentExists) {
      const document = await Document.findOneAndUpdate(
        {
          userId: req?.params?.userId,
          isDeleted: false,
        },
        {
          $set: { isDeleted: true },
        },
        {
          new: true,
        }
      ).exec();
    }

    const isPaymentExists = await Payment.find({
      userId: req?.params?.userId,
      isDeleted: false,
    }).exec();

    if (isPaymentExists.length) {
      await Payment.updateMany(
        { userId: req?.params?.userId, isDeleted: false },
        { $set: { isDeleted: true } }
      ).exec();
    }

    const ISubscriber = await MySubscription.findOne({
      userId: req?.params?.userId,
      isDeleted: false,
    }).exec();

    if (ISubscriber) {
      await MySubscription.updateOne(
        { userId: req?.params?.userId, isDeleted: false },
        { $set: { isDeleted: true } }
      ).exec();
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();

    res.status(201).json({ message: "User deleted" });
    // }

    res.status(401).json({ message: "Unauthorized Access" });
  } catch (error) {
    next(error);
  }
};

export const approveUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, {
      approved: true,
    }).exec();
    res.status(201).json({ message: "User Approved" });
  } catch (error) {
    next(error);
  }
};

export const uploadDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new Error("Error Uploading File");
    }

    const userObj = await User.findByIdAndUpdate(req.params.userId, {
      $push: { documents: { fileName: req.file?.filename } },
    }).exec();

    if (!userObj) {
      throw new Error(`User does not exist`);
    }

    res.json({ message: "Image Uploaded", data: req.file.filename });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];

    const queryStr = String(req.query.query || "").trim();
    if (queryStr) {
      const regex = new RegExp(queryStr, "i");
      pipeline.push({
        $match: {
          $or: [{ name: regex }, { email: regex }, { phone: regex }],
        },
      });
    }

    let userArr = await paginateAggregate(User, pipeline, req.query);

    res.status(200).json({
      message: "Found all users",
      data: userArr.data,
      total: userArr.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({ message: "User Data", data: req.user?.userObj });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const obj: any = {};
    if (req.body.name) {
      obj.name = req.body.name;
    }
    if (req.body.password && req.body.password != "") {
      obj.password = await encryptPassword(req.body.password);
    } else {
      delete obj.password;
    }
    if (req.body.email) {
      const user = await User.find({
        email: new RegExp(`^${req.body.email}$`, "i"),
        _id: { $ne: req.user?.userId },
      }).exec();
      if (user.length) {
        throw new Error("This email is already being used");
      }

      obj.email = req.body.email;
    }
    if (req.body.address) {
      obj.address = req.body.address;
    }
    // if (req.body.name) {
    //   obj.name = req.body.name;
    // }

    const user = await User.findByIdAndUpdate(req.user?.userId, obj, {
      new: true,
    }).exec();
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    res.json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};
export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req?.params?.id).exec();
    if (!user) {
      throw new Error("User does not exists");
    }

    let nameExists = await User.findOne({
      name: new RegExp(`^${req.body.name}$`, "i"),
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
    })
      .lean()
      .exec();
    if (nameExists) {
      throw new Error(
        "Name you are trying to add already exists in our database for another user"
      );
    }
    // let phoneExists = await User.findOne({phone:new RegExp(`^${req.body.phone}$`, "i"), _id:{$ne:new mongoose.Types.ObjectId(req.params.id)}}).lean().exec();
    // if (phoneExists) {
    // 	throw new Error("Phone number you are trying to add already exists in our database for another user");
    // }
    let emailExists = await User.findOne({
      email: new RegExp(`^${req.body.email}$`, "i"),
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
    })
      .lean()
      .exec();
    if (emailExists) {
      throw new Error(
        "Email you are trying to add already exists in our database for another user"
      );
    }

    if (req.body.userName && req.body.userName != "") {
      const UserExistUserNameCheck = await User.findOne({
        userName: new RegExp(`^${req.body.userName}$`, "i"),
      }).exec();

      if (UserExistUserNameCheck) {
        throw new Error(`User with this username already exists`);
      }
    }

    if (req.body.password && req.body.password != "") {
      req.body.password = await encryptPassword(req.body.password);
    } else {
      delete req.body.password;
    }

    await User.findByIdAndUpdate(req?.params?.id, req.body, {
      new: true,
    }).exec();
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    res.json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: any = await User.findById(req?.params?.id).lean().exec();
    if (!user) {
      throw new Error("User does not exists");
    }

    const token = await generateAccessJwt({
      userId: user._id,
      role: user.role,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        _id: user._id,
        accessObj: user.accessObj,
      },
    });

    if (user.role == DEPARTMENT.STORES) {
      let pipeline = [
        {
          $match: {
            department: DEPARTMENT.STORES,
            _id: new mongoose.Types.ObjectId(req?.params?.id),
          },
        },
        {
          $unwind: {
            path: "$rawMaterialArr",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "rawmaterials",
            localField: "rawMaterialArr.rawMaterialId",
            foreignField: "_id",
            as: "rawMaterialObj",
          },
        },
        {
          $unwind: {
            path: "$rawMaterialObj",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            "rawMaterialArr.label": "$rawMaterialObj.name",
            "rawMaterialArr.value": "$rawMaterialObj._id",
          },
        },
        {
          $group: {
            _id: "$_id",
            name: {
              $first: "$name",
            },
            email: {
              $first: "$email",
            },
            password: {
              $first: "$password",
            },
            rawMaterialArr: {
              $addToSet: "$rawMaterialArr",
            },
          },
        },
      ];
      let tempUser = await User.aggregate(pipeline);
      if (tempUser && tempUser.length == 0) {
        return res.status(400).json({ message: "User Not Found" });
      }
      user = tempUser[0];
    }

    res.json({ message: "found user", data: user, token });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToDelete = await User.findById(req.params.userId).exec();

    if (!userToDelete) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Check if user is admin for hard delete
    if (userToDelete.role === "ADMIN") {
      // Hard delete all related documents
      await Document.deleteMany({
        userId: req.params.userId,
      }).exec();

      // Hard delete all related payments
      await Payment.deleteMany({
        userId: req.params.userId,
      }).exec();

      // Hard delete subscription
      await MySubscription.deleteOne({
        userId: req.params.userId,
      }).exec();

      // Hard delete the user
      await User.findByIdAndDelete(req.params.userId).exec();

      return res
        .status(200)
        .json({ message: "Admin user permanently deleted" });
    } else {
      // Soft delete for non-admin users (existing logic)
      const isDocumentExists = await Document.findOne({
        userId: req.params.userId,
        isDeleted: false,
      }).exec();

      if (isDocumentExists) {
        await Document.findOneAndUpdate(
          {
            userId: req.params.userId,
            isDeleted: false,
          },
          {
            $set: { isDeleted: true },
          },
          {
            new: true,
          }
        ).exec();
      }

      const isPaymentExists = await Payment.find({
        userId: req.params.userId,
        isDeleted: false,
      }).exec();

      if (isPaymentExists.length) {
        await Payment.updateMany(
          { userId: req.params.userId, isDeleted: false },
          { $set: { isDeleted: true } }
        ).exec();
      }

      const ISubscriber = await MySubscription.findOne({
        userId: req.params.userId,
        isDeleted: false,
      }).exec();

      if (ISubscriber) {
        await MySubscription.updateOne(
          { userId: req.params.userId, isDeleted: false },
          { $set: { isDeleted: true } }
        ).exec();
      }

      await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { isDeleted: true } },
        { new: true }
      ).exec();

      return res.status(200).json({ message: "User soft deleted" });
    }
  } catch (error) {
    next(error);
  }
};
