import { NextFunction, Request, Response } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { Types } from "mongoose";
import { Payment } from "@models/payment.model";
import {
  ISubscription,
  UserSubscription,
} from "@models/userSubscription.model";
import { MySubscription } from "@models/mySubscription.model";
import { User } from "@models/user.model";
import { SendBrevoMail } from "../service/brevoMail.service";
import { planBuy } from "../../util/emailTemplate";
import { generatePayUHash, verifyPayUHash } from "../../util/payuHash";
import { PipelineStage } from "mongoose";
import PDFDocument from "pdfkit";
// A centralized place for configuration is better than process.env everywhere
const paymentConfig = {
  PAYU_KEY: process.env.PAYU_KEY!,

  PAYU_SALT: process.env.PAYU_SALT!,
  PAYU_SALT_V1: process.env.PAYU_SALT_V1!,
  PAYU_URL: process.env.PAYU_URL || "https://secure.payu.in/_payment",
  BACKEND_URL: process.env.BACKEND_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
};

// --- Helper Functions ---

const _createNewSubscription = async (
  userId: mongoose.Types.ObjectId,
  monthsToAdd: number,
  subscriptionPlanId: mongoose.Types.ObjectId
) => {
  const startDate = new Date();
  const endDate = new Date(startDate); // Create a new date object to avoid mutation
  endDate.setMonth(startDate.getMonth() + monthsToAdd);

  await MySubscription.create({
    userId,
    subscriptionId: subscriptionPlanId,
    isDeleted: false,
    startDate,
    endDate,
    isActive: true,
  });
};

const _sendSuccessEmail = async (paymentId: Types.ObjectId) => {
  try {
    // Use the aggregation pipeline to get all data in one go
    const paymentDetailsArr = await Payment.aggregate([
      { $match: { _id: paymentId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "usersubscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscription",
        },
      },
      { $unwind: "$subscription" },
      {
        $project: {
          userName: "$user.name",
          userEmail: "$user.email",
          planName: "$subscription.name",
          amount: 1,
          transactionId: "$gatwayPaymentObj.txnid",
        },
      },
    ]);

    if (!paymentDetailsArr || paymentDetailsArr.length === 0) {
      console.error(
        `Could not find details for payment ID: ${paymentId} to send email.`
      );
      return;
    }

    const details = paymentDetailsArr[0];

    // Prepare the dynamic data for the template
    const templateDetails = {
      userName: details.userName,
      planName: details.planName || "Premium Plan",
      amountPaid: `₹${new Intl.NumberFormat("en-IN").format(details.amount)}`,
      transactionId: details.transactionId,
      dashboardUrl: `${paymentConfig.FRONTEND_URL}/dashboard`, // Example URL
      frontendUrl: paymentConfig.FRONTEND_URL,
    };

    // Generate the dynamic HTML
    const htmlContent = planBuy(templateDetails);

    // Send the email
    await SendBrevoMail(
      "Your Plan is Confirmed!",
      [{ name: details.userName, email: details.userEmail }],
      htmlContent
    );
  } catch (error) {
    console.error("Failed to send plan confirmation email:", error);
  }
};

// --- Controller Methods ---

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, couponDiscount = 0, extraAmount = 0 } = req.body;
    const { userId } = req.user!;

    const existingSubscription = await MySubscription.findOne({
      userId,
      isActive: true,
    }).lean();

    // 2. If one exists, block the purchase.
    if (existingSubscription) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an active subscription and cannot purchase another.",
      });
    }

    const subscriptionPlan = await UserSubscription.findById(orderId).lean();
    if (!subscriptionPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription plan not found." });
    }

    const user = await User.findById(userId, "name email phone").lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const finalAmount =
      subscriptionPlan.discountedPrice - couponDiscount + extraAmount;

    const paymentRecord = await Payment.create({
      userId,
      orderId: subscriptionPlan._id,
      subscriptionId: subscriptionPlan._id,
      amount: finalAmount,
      message: `${finalAmount} payment for subscription ${subscriptionPlan.name}`,
    });

    const txnid = paymentRecord._id.toString();
    const amount = finalAmount.toFixed(2);

    const hashParams = {
      key: paymentConfig.PAYU_KEY,
      txnid,
      amount,
      productinfo: `${subscriptionPlan.name} Subscription`,
      firstname: user.name || "User",
      email: user.email || "",
    };

    const hash = generatePayUHash(hashParams, paymentConfig.PAYU_SALT);

    const paymentFields = {
      ...hashParams,
      phone: user.phone || "",
      surl: `${paymentConfig.BACKEND_URL}/v1/payment/callback/${txnid}`,
      furl: `${paymentConfig.BACKEND_URL}/v1/payment/callback/${txnid}`,
      hash,
      service_provider: "payu_paisa",
    };

    // Storing the fields sent to the gateway can be useful for debugging
    paymentRecord.gatwayPaymentObj = paymentFields;
    await paymentRecord.save();

    res.status(200).json({
      success: true,
      message: "Payment initiated.",
      paymentForm: {
        action: paymentConfig.PAYU_URL,
        fields: paymentFields,
      },
      orderId: txnid,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { txnid, status } = req.body;

    // 1. Verify Hash
    const isValidHash = verifyPayUHash(req.body, paymentConfig.PAYU_SALT_V1);
    if (!isValidHash) {
      // Redirect to a failure page, maybe log this attempt
      return res.redirect(
        `${paymentConfig.FRONTEND_URL}/failure/${txnid}?error=invalid_hash`
      );
    }

    // 2. Find Payment and Check Status
    const paymentRecord = await Payment.findById(txnid);
    if (!paymentRecord) {
      // This should not happen if the txnid came from PayU
      return res.redirect(
        `${paymentConfig.FRONTEND_URL}/failure/${txnid}?error=not_found`
      );
    }

    if (paymentRecord.paymentcheck) {
      // Payment already processed, redirect to success to avoid user confusion
      return res.redirect(
        `${paymentConfig.FRONTEND_URL}/success/${txnid}?msg=already_processed`
      );
    }

    // // 3. Update Payment Record
    // paymentRecord.paymentcheck = true; // Mark as processed to prevent replay
    // paymentRecord.status = status;
    // paymentRecord.gatwayPaymentObj = {
    //   key: req.body.key,
    //   txnid: req.body.txnid,
    //   amount: req.body.amount,
    //   productinfo: req.body.productinfo,
    //   firstname: req.body.firstname,
    //   email: req.body.email,
    //   phone: req.body.phone,
    //   surl: req.body.surl,
    //   furl: req.body.furl,
    //   hash: req.body.hash,
    //   service_provider: req.body.service_provider,
    //   // Store only gateway response, not the whole body
    //   status,
    //   payuMoneyId: req.body.payuMoneyId,
    //   mode: req.body.mode,
    //   bankcode: req.body.bankcode,
    // };
    // await paymentRecord.save();

    // // 4. Handle failed payment
    // if (status !== "success") {
    //   return res.redirect(`${paymentConfig.FRONTEND_URL}/failure/${txnid}`);
    // }

    // ## FIX STARTS HERE ##

    // 3. Update Payment Record Conditionally
    const isPaymentSuccessful = status === "success";

    // Only mark as checked/final if the payment was successful.
    paymentRecord.paymentcheck = isPaymentSuccessful;
    paymentRecord.status = status;

    // Store the relevant response from the gateway for logging purposes.
    // Renamed to `gatewayResponse` for clarity.
    paymentRecord.gatwayPaymentObj = {
      key: req.body.key,
      txnid: req.body.txnid,
      amount: req.body.amount,
      productinfo: req.body.productinfo,
      firstname: req.body.firstname,
      email: req.body.email,
      phone: req.body.phone,
      surl: req.body.surl,
      furl: req.body.furl,
      hash: req.body.hash,
      service_provider: req.body.service_provider,
      status,
      payuMoneyId: req.body.payuMoneyId,
      mode: req.body.mode,
      bankcode: req.body.bankcode,
      // You can add any other relevant fields from req.body here
    };

    await paymentRecord.save();

    // 4. Handle failed or canceled payment
    if (!isPaymentSuccessful) {
      return res.redirect(`${paymentConfig.FRONTEND_URL}/failure/${txnid}`);
    }

    // 5. Process Successful Payment
    const subscriptionPlan = await UserSubscription.findById(
      paymentRecord.subscriptionId
    ).lean();
    if (!subscriptionPlan) {
      throw new Error(`Subscription plan not found for payment ${txnid}`);
    }

    await _createNewSubscription(
      new mongoose.Types.ObjectId(paymentRecord.userId),
      subscriptionPlan.numberOfMonths,
      subscriptionPlan._id
    );

    await _sendSuccessEmail(new mongoose.Types.ObjectId(paymentRecord._id));

    // 6. Redirect to Frontend
    res.redirect(`${paymentConfig.FRONTEND_URL}/success/${txnid}`);
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({
      _id: req?.user?.userId,
      isDeleted: false,
    }).exec();
    if (!user) throw new Error("User Not Found");

    const paymentObj = await Payment.findOne({
      userId: user?._id,
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!paymentObj) throw new Error("Order Not Found");
    res.json({ message: "Payment Data", data: paymentObj });
  } catch (error) {
    next(error);
  }
};

export const getAllPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchQuery = req.query.query as string | undefined;

    const pipeline: PipelineStage[] = [
      // ## ROBUSTNESS FIX ##
      // Stage 1: Convert string IDs to ObjectIds to prevent lookup failure.
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" },
          subscriptionObjectId: { $toObjectId: "$subscriptionId" },
        },
      },

      // Stage 2: Join with 'users' using the converted ObjectId.
      {
        $lookup: {
          from: "users", // <-- Double-check this collection name in your DB
          localField: "userObjectId", // Use the converted field
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // Stage 3: Join with 'usersubscriptions' using the converted ObjectId.
      {
        $lookup: {
          from: "usersubscriptions", // <-- Double-check this collection name
          localField: "subscriptionObjectId", // Use the converted field
          foreignField: "_id",
          as: "subscription",
        },
      },
      { $unwind: { path: "$subscription", preserveNullAndEmptyArrays: true } },

      // Stage 4: Project the final, clean output.
      {
        $project: {
          _id: 1,
          amount: 1,
          status: 1,
          isDeleted: { $ifNull: ["$isDeleted", false] }, // Include isDeleted field
          paymentcheck: 1,
          message: 1,
          createdAt: 1,
          userName: { $ifNull: ["$user.name", "Unknown"] },
          userEmail: { $ifNull: ["$user.email", "N/A"] },
          subscriptionName: { $ifNull: ["$subscription.name", "N/A"] },
          transactionId: { $ifNull: ["$gatwayPaymentObj.txnid", "N/A"] },
          paymentMode: { $ifNull: ["$gatwayPaymentObj.mode", "N/A"] },
          gatewayPaymentObj: {
            key: { $ifNull: ["$gatwayPaymentObj.key", "N/A"] },
            txnid: { $ifNull: ["$gatwayPaymentObj.txnid", "N/A"] },
            amount: { $ifNull: ["$gatwayPaymentObj.amount", "N/A"] },
            productinfo: { $ifNull: ["$gatwayPaymentObj.productinfo", "N/A"] },
            firstname: { $ifNull: ["$gatwayPaymentObj.firstname", "N/A"] },
            email: { $ifNull: ["$gatwayPaymentObj.email", "N/A"] },
            phone: { $ifNull: ["$gatwayPaymentObj.phone", "N/A"] },
            surl: { $ifNull: ["$gatwayPaymentObj.surl", "N/A"] },
            furl: { $ifNull: ["$gatwayPaymentObj.furl", "N/A"] },
            hash: { $ifNull: ["$gatwayPaymentObj.hash", "N/A"] },
            service_provider: {
              $ifNull: ["$gatwayPaymentObj.service_provider", "N/A"],
            },
            status: { $ifNull: ["$gatwayPaymentObj.status", "N/A"] },
            payuMoneyId: { $ifNull: ["$gatwayPaymentObj.payuMoneyId", "N/A"] },
            mode: { $ifNull: ["$gatwayPaymentObj.mode", "N/A"] },
            bankcode: { $ifNull: ["$gatwayPaymentObj.bankcode", "N/A"] },
          },
        },
      },

      // Stage 5: Sort results.
      { $sort: { createdAt: -1 } },
    ];

    // Conditionally insert the $match stage for searching
    if (searchQuery) {
      const searchConditions: Record<string, any>[] = [
        { "user.name": new RegExp(searchQuery, "i") },
        { "subscription.name": new RegExp(searchQuery, "i") },
      ];
      if (Types.ObjectId.isValid(searchQuery)) {
        searchConditions.push({ _id: new Types.ObjectId(searchQuery) });
      }
      pipeline.splice(5, 0, { $match: { $or: searchConditions } });
    }

    const paymentList = await paginateAggregate(Payment, pipeline, req.query);

    return res.status(200).json({
      message: "Payments retrieved successfully.",
      success: true,
      data: paymentList.data,
      total: paymentList.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 1. Validate the incoming ID
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Payment ID format." });
    }

    const pipeline: PipelineStage[] = [
      // ## FIX 1: Match by ID at the very beginning for maximum efficiency ##
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      // Now, use the rest of the pipeline from `getAllPayment` to populate the data
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" },
          subscriptionObjectId: { $toObjectId: "$subscriptionId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "usersubscriptions",
          localField: "subscriptionObjectId",
          foreignField: "_id",
          as: "subscription",
        },
      },
      { $unwind: { path: "$subscription", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userId: 1,
          subscriptionId: 1,
          amount: 1,
          status: 1,
          paymentcheck: 1,
          message: 1,
          createdAt: 1,
          userName: { $ifNull: ["$user.name", "Unknown"] },
          userEmail: { $ifNull: ["$user.email", "N/A"] },
          subscriptionName: { $ifNull: ["$subscription.name", "N/A"] },
          transactionId: { $ifNull: ["$gatwayPaymentObj.txnid", "N/A"] },
          paymentMode: { $ifNull: ["$gatwayPaymentObj.mode", "N/A"] },
          bankCode: { $ifNull: ["$gatwayPaymentObj.bankcode", "N/A"] },
          gatewayPaymentObj: {
            key: { $ifNull: ["$gatwayPaymentObj.key", "N/A"] },
            txnid: { $ifNull: ["$gatwayPaymentObj.txnid", "N/A"] },
            amount: { $ifNull: ["$gatwayPaymentObj.amount", "N/A"] },
            productinfo: { $ifNull: ["$gatwayPaymentObj.productinfo", "N/A"] },
            firstname: { $ifNull: ["$gatwayPaymentObj.firstname", "N/A"] },
            email: { $ifNull: ["$gatwayPaymentObj.email", "N/A"] },
            phone: { $ifNull: ["$gatwayPaymentObj.phone", "N/A"] },
            surl: { $ifNull: ["$gatwayPaymentObj.surl", "N/A"] },
            furl: { $ifNull: ["$gatwayPaymentObj.furl", "N/A"] },
            hash: { $ifNull: ["$gatwayPaymentObj.hash", "N/A"] },
            service_provider: {
              $ifNull: ["$gatwayPaymentObj.service_provider", "N/A"],
            },
            status: { $ifNull: ["$gatwayPaymentObj.status", "N/A"] },
            payuMoneyId: { $ifNull: ["$gatwayPaymentObj.payuMoneyId", "N/A"] },
          },
        },
      },
    ];

    const paymentDetailsArr = await Payment.aggregate(pipeline);

    // 2. Check if the payment was found
    if (!paymentDetailsArr || paymentDetailsArr.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    // 3. Return the populated data with the correct status code
    return res.status(200).json({
      message: "Payment details retrieved successfully.",
      success: true,
      data: paymentDetailsArr[0], // Return the single object, not the array
    });
  } catch (error) {
    next(error);
  }
};

export const downloadInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Ensure user is authenticated and get their ObjectId
    if (!req?.user?.userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    let userId;
    if (Types.ObjectId.isValid(req.user.userId)) {
      userId = new Types.ObjectId(req.user.userId);
    } else {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    // 2. Find the LATEST payment record for this user
    const latestPayment = await Payment.findOne({
      $or: [{ userId: userId }, { userId: userId.toString() }],
      isDeleted: false, // Ensure we only consider non-deleted records
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!latestPayment) {
      return res
        .status(404)
        .json({ message: "No payment record found for this user." });
    }

    // 3. Enhanced aggregation pipeline to gather all necessary data
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: latestPayment._id },
      },
      {
        $addFields: {
          userIdObjectId: { $toObjectId: "$userId" },
          subscriptionIdObjectId: { $toObjectId: "$subscriptionId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObjectId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "usersubscriptions",
          localField: "subscriptionIdObjectId",
          foreignField: "_id",
          as: "subscriptionDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: {
          path: "$subscriptionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          createdAt: 1,
          status: { $ifNull: ["$status", "SUCCESS"] },
          userName: { $ifNull: ["$userDetails.name", "N/A"] },
          userEmail: { $ifNull: ["$userDetails.email", "N/A"] },
          userPhone: { $ifNull: ["$userDetails.phone", "N/A"] },
          subscriptionName: {
            $ifNull: ["$subscriptionDetails.subscriptionType", "N/A"],
          },
          subscriptionDuration: {
            $ifNull: ["$subscriptionDetails.duration", "N/A"],
          },
          transactionId: {
            $ifNull: ["$gatwayPaymentObj.merchantTransactionId", "$_id"],
          },
        },
      },
    ];

    const results = await Payment.aggregate(pipeline);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Could not generate invoice data." });
    }

    const invoiceData = results[0];

    // 4. Generate and stream the PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoiceData.transactionId.toString()}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Use the helper functions to build the PDF
    generateHeader(doc);
    generateCustomerInformation(doc, invoiceData);
    generateInvoiceTable(doc, invoiceData);
    generateFooter(doc);

    doc.end();
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    next(error);
  }
};

// pdf invoice generation helper functions

export const downloadInvoicePrev = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req?.user?.userId, "userId");
    if (!req?.user?.userId) {
      // Ensure user is authenticated
      throw new Error("User not authenticated.");
    }
    const userId = req.user?.userId;

    const paymentData = await Payment.findOne({ userId: req?.user?.userId })
      .lean()
      .exec();

    if (!paymentData) {
      return res
        .status(404)
        .json({ message: "No payment record found for this user." });
    }

    // 1. Validate the incoming ID
    if (!Types.ObjectId.isValid(paymentData?._id)) {
      return res.status(400).json({ message: "Invalid Payment ID format." });
    }

    // 2. Define the correct aggregation pipeline to fetch payment, user, and subscription data
    const pipeline: PipelineStage[] = [
      {
        // Match the specific payment record by its ID
        $match: { _id: new Types.ObjectId(paymentData?._id) },
      },
      {
        // Lookup user details from the 'users' collection
        $lookup: {
          from: "users",
          localField: "userId", // Assuming 'userId' in Payment collection is the string ID of the user
          foreignField: "_id", // Matching against the '_id' in the User collection
          as: "userDetails",
        },
      },
      {
        // Lookup subscription details from the 'usersubscriptions' collection
        $lookup: {
          from: "usersubscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscriptionDetails",
        },
      },
      {
        // Deconstruct the looked-up arrays to get single objects
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: {
          path: "$subscriptionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Project only the fields needed for the invoice
        $project: {
          _id: 1,
          amount: 1,
          createdAt: 1,
          userName: { $ifNull: ["$userDetails.name", "N/A"] },
          userEmail: { $ifNull: ["$userDetails.email", "N/A"] },
          subscriptionName: {
            $ifNull: ["$subscriptionDetails.subscriptionType", "N/A"],
          }, // Adjust field name if needed
          transactionId: { $ifNull: ["$gatwayPaymentObj.txnid", "N/A"] },
          paymentMode: { $ifNull: ["$gatwayPaymentObj.mode", "N/A"] },
        },
      },
    ];

    const results = await Payment.aggregate(pipeline);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    const payment = results[0];

    console.log("Payment Data:", payment);

    // 3. Generate the PDF (This part remains the same)
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${
        payment.transactionId || payment._id
      }.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // --- PDF Content ---

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "center" });
    doc.moveDown(2);

    // Billed To and Company Info
    const customerInfoY = doc.y;
    doc.fontSize(12).font("Helvetica-Bold").text("Billed To:");
    doc.font("Helvetica").text(payment.userName);
    doc.text(payment.userEmail);

    doc.y = customerInfoY; // Reset Y to align "From" info
    doc.font("Helvetica-Bold").text("From:", { align: "right" });
    doc
      .font("Helvetica")
      .text("Marriage Registration Wala", { align: "right" });
    doc.text("D-76, Ground Floor, Kamla Nagar, Delhi - 110007", {
      align: "right",
    });

    doc.moveDown(3);

    // Invoice Details Table
    const detailsTop = doc.y;
    doc.fontSize(10);
    doc.font("Helvetica-Bold").text("Invoice Number:");
    doc.font("Helvetica").text(String(payment._id), 200, detailsTop);

    doc.font("Helvetica-Bold").text("Transaction ID:");
    doc.font("Helvetica").text(payment.transactionId, 200, doc.y - 12);

    doc.font("Helvetica-Bold").text("Payment Date:");
    doc
      .font("Helvetica")
      .text(
        new Date(payment.createdAt).toLocaleDateString("en-GB"),
        200,
        doc.y - 12
      );

    doc.font("Helvetica-Bold").text("Payment Method:");
    doc.font("Helvetica").text(payment.paymentMode, 200, doc.y - 12);

    doc.moveDown(3);

    // Line Items Table
    const tableTop = doc.y;
    doc.font("Helvetica-Bold");
    doc.text("Description", 50, tableTop);
    doc.text("Amount", 450, tableTop, { align: "right" });
    doc
      .moveTo(50, tableTop + 20)
      .lineTo(550, tableTop + 20)
      .stroke();

    doc.font("Helvetica");
    const itemY = tableTop + 30;
    doc.text(payment.subscriptionName, 50, itemY, { width: 400 });
    doc.text(`₹${payment.amount.toFixed(2)}`, 450, itemY, { align: "right" });

    // Position for the Total
    const totalY = itemY + 30;
    doc.moveTo(50, totalY).lineTo(550, totalY).stroke();

    // Total
    doc.moveDown(2);
    doc.font("Helvetica-Bold").fontSize(14);
    doc.text(`Total Paid: ₹${payment.amount.toFixed(2)}`, { align: "right" });

    // Footer
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Thank you for your business!", 50, 750, {
        align: "center",
        width: 500,
      });

    doc.end();
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    next(error);
  }
};

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .rect(0, 0, doc.page.width, 90)
    .fill("#2c3e50")
    .fontSize(20)
    .font("Helvetica-Bold")
    .fillColor("white")
    .text("Marriage Registration Wala", 50, 40)
    .fontSize(22)
    .text("INVOICE", 0, 40, { align: "right" })
    .moveDown(0.5);
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, invoice: any) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 110);
  generateHr(doc, 135);

  const customerInformationTop = 150;

  // Left Column: Invoice & Payment Details
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica")
    .text(invoice._id.toString(), 150, customerInformationTop)

    .font("Helvetica-Bold")
    .text("Transaction ID:", 50, customerInformationTop + 15)
    .font("Helvetica")
    .text(invoice.transactionId.toString(), 150, customerInformationTop + 15)

    .font("Helvetica-Bold")
    .text("Payment Date:", 50, customerInformationTop + 30)
    .font("Helvetica")
    .text(
      invoice.createdAt
        ? new Date(invoice.createdAt).toLocaleDateString("en-GB")
        : "N/A",
      150,
      customerInformationTop + 30
    )
    .font("Helvetica-Bold")
    .text("Status:", 50, customerInformationTop + 45)
    .font("Helvetica")
    .fillColor("#28a745") // Green for success
    .text(
      String(invoice.status || "SUCCESS").toUpperCase(),
      150,
      customerInformationTop + 45
    );

  // Right Column: Billed To
  doc
    .fillColor("black") // Reset color
    .font("Helvetica-Bold")
    .text("Bill To:", 350, customerInformationTop)
    .font("Helvetica")
    .text(invoice.userName || "N/A", 350, customerInformationTop + 15)
    .text(invoice.userEmail || "N/A", 350, customerInformationTop + 30)
    .text(invoice.userPhone || "", 350, customerInformationTop + 45, {
      width: 200,
    })
    .moveDown();

  generateHr(doc, 220);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, invoice: any) {
  const tableTop = 250;

  // Table Header
  doc.font("Helvetica-Bold");
  generateTableRow(doc, tableTop, "Description", "Duration", "Amount");
  generateHr(doc, tableTop + 20);
  doc.font("Helvetica");

  // Table Content Row
  const item = {
    description: invoice.subscriptionName,
    duration: invoice.subscriptionDuration,
    amount: invoice.amount,
  };
  const itemPosition = tableTop + 30;
  generateTableRow(
    doc,
    itemPosition,
    item.description,
    item.duration,
    `Rs. ${item.amount.toFixed(2)}`
  );
  generateHr(doc, itemPosition + 20);

  // Totals Section
  const totalsTop = itemPosition + 40;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    totalsTop,
    "",
    "Total Paid",
    `Rs. ${invoice.amount.toFixed(2)}`
  );
  doc.font("Helvetica");
}

function generateFooter(doc: PDFKit.PDFDocument) {
  generateHr(doc, 750);
  doc
    .fontSize(10)
    .text(
      "Thank you for your business. This is a computer-generated invoice.",
      50,
      760,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  c1: string,
  c2: string,
  c3: string
) {
  doc
    .fontSize(10)
    .text(c1, 50, y, { width: 200 })
    .text(c2, 280, y, { width: 90, align: "right" })
    .text(c3, 0, y, { align: "right" });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount: number) {
  return `Rs. ${(amount || 0).toFixed(2)}`;
}
