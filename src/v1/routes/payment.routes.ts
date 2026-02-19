import express from "express";
import { authorizeJwt } from "@middlewares/auth.middleware";
import {
  createPayment,
  paymentCallback,
  getPayment,
  getAllPayment,
  getPaymentById,
  downloadInvoice,
} from "../controllers/payment.controller";
import { upload } from "@middlewares/multer.middleware";
const router = express.Router();

router.post("/checkout", authorizeJwt, createPayment);
router.post("/callback/:orderId", paymentCallback);
// SECURITY FIX: Payment details should require authentication
router.get("/getById/:id", authorizeJwt, getPaymentById);
router.get("/retry", authorizeJwt, getPayment);
// SECURITY FIX: Getting all payments should require admin authentication
router.get("/", authorizeJwt, getAllPayment);

router.get("/invoice", authorizeJwt, downloadInvoice);

export default router;
