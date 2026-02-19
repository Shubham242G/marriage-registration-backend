import {
  addUser,
  approveUserById,
  deleteUserById,
  getAllUsers,
  getProfile,
  getUserById,
  refreshToken,
  registerUser,
  updateProfile,
  updateUserById,
  uploadDocuments,
  registerUserWithPhone,
  registerUserWithEmail,
  verifyOtpForRegister,
  loginUser,
  loginUserWithPhone,
  mySubscription,
  forgetPassword,
  resetPassword,
  addUserDetails,
  updateUserDetails,
  getUser,
  verifyOtp,
  adminLogin,
  adminRegister,
  adminUpdateUserDetails,
  adminGetAllUsers,
  adminDeleteUserById,
} from "@controllersv1/user.controller";
import { authorizeJwt } from "@middlewares/auth.middleware";
import { upload } from "@middlewares/multer.middleware";
import { MySubscription } from "@models/mySubscription.model";
import express from "express";

const router = express.Router();

router.post("/admin/login", adminLogin);
// SECURITY FIX: Admin registration should require existing admin authorization
router.post("/admin/register", authorizeJwt, adminRegister);
router.patch("/admin/updateUser/:id", authorizeJwt, adminUpdateUserDetails);
router.get("/admin/getAllUsers", adminGetAllUsers);
router.delete("/admin/deleteById/:userId", authorizeJwt, adminDeleteUserById);

// Route for user registration
router.post("/register/phone", registerUserWithPhone);
router.post("/register/email", registerUserWithEmail);
router.post("/login/phone", loginUserWithPhone);
router.post("/verifyOtp", verifyOtpForRegister);
router.post("/verifyOtp/login", verifyOtp);
router.post("/login/User", loginUser);
// router.post("/resetPassword", registerUser);
router.get("/mySubscription", authorizeJwt, mySubscription);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

// Route for adding a new user (restricted by JWT authorization)
router.post("/addUser", authorizeJwt, addUserDetails);
// SECURITY FIX: User update should require authentication
router.patch("/updateUser/:id", authorizeJwt, updateUserDetails);
router.get("/getUser", authorizeJwt, getUser);
// Route for getting all users - SECURITY FIX: Requires authentication
router.get("/getAllUsers", authorizeJwt, getAllUsers);

// Route for deleting a user by ID - SECURITY FIX: Requires authentication
router.delete("/deleteById/:userId", authorizeJwt, deleteUserById);

router.post("/refreshToken", refreshToken);
// Route for approving a user by ID
router.patch("/approveUserById/:userId", authorizeJwt, approveUserById);

// Route for uploading documents for a user
router.post(
  "/upload-documents/:userId",
  authorizeJwt,
  upload.single("file"),
  uploadDocuments
);

// Route for getting user profile (restricted by JWT authorization)
router.get("/getProfile", authorizeJwt, getProfile);

// Route for updating user profile (restricted by JWT authorization)
router.patch("/updateProfile", authorizeJwt, updateProfile);

// Route for getting a user by ID
router.get("/getById/:id", getUserById);

// Route for updating a user by ID
router.patch("/updateById/:id", authorizeJwt, updateUserById);

// Exporting the router instance to make it available for use in other modules
export default router;
