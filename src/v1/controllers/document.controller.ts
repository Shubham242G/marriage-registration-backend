import { NextFunction, Request, Response } from "express";
import mongoose, { PipelineStage } from "mongoose";

import { paginateAggregate } from "@helpers/paginateAggregate";
import { deleteFile, storeFileAndReturnNameBase64 } from "@helpers/fileSystem";

import { Document } from "@models/document.model";
import { User } from "@models/user.model";

import {
  documentRejectionAndReUpload,
  documentSumittedSuccessfully,
  successfullDocumentVerification,
} from "../../util/emailTemplate";

import { SendBrevoMail } from "../service/brevoMail.service";

/**
 * ============================================================
 * HELPER: Process Base64 Files
 * ============================================================
 */
const saveBase64File = async (fieldName: string, body: any) => {
  const value = body?.[fieldName];
  if (value && typeof value === "string" && value.includes("base64")) {
    body[fieldName] = await storeFileAndReturnNameBase64(value);
  }
};

const updateBase64File = async (fieldName: string, body: any, existingDoc: any) => {
  const newValue = body?.[fieldName];
  if (newValue && typeof newValue === "string" && newValue.includes("base64")) {
    const oldValue = existingDoc?.[fieldName];
    if (oldValue) {
      await deleteFile(oldValue);
    }
    body[fieldName] = await storeFileAndReturnNameBase64(newValue);
  }
};

/**
 * ============================================================
 * ADD DOCUMENT
 * ============================================================
 */
export const addDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user?.userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const userId = req.user.userId;

    // Check if document already exists
    const existsCheck = await Document.findOne({
      userId,
      isDeleted: false,
    }).lean().exec();

    if (existsCheck) {
      return res.status(400).json({
        message: "Document already exists for this user",
      });
    }

    // Process all base64 files
    const fileFields = [
      // Groom Documents
      'groomAadharFront', 'groomAadharBack',
      'groomVoterIdFront', 'groomVoterIdBack',
      'groomPassportFront', 'groomPassportBack',
      'groomBirthCertificateImage',
      // Bride Documents
      'brideAadharFront', 'brideAadharBack',
      'brideOtherProofImage', 'brideBirthProofImage',
      // Marriage Proof
      'marriageProofPhoto', 'marriageProofCoupleImage', 'marriageProofInvitation',
      // Religious Certificate
      'religiousCertificateImage',
      // Witness 1
      'witness1AadharFront', 'witness1AadharBack', 'witness1PanCardPhoto',
      // Witness 2
      'witness2AadharFront', 'witness2AadharBack', 'witness2PanCardPhoto',
      // Signatures
      'signatureImageGroom', 'signatureImageBride',
      'signatureImageWitness1', 'signatureImageWitness2',
    ];

    for (const field of fileFields) {
      await saveBase64File(field, req.body);
    }

    // Check if user exists
    const userExist = await User.findById(userId).lean().exec();
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send submission email
    if (userExist.name && userExist.email) {
      const frontendUrl = `${process.env.FRONTEND_URL}/document`;
      const html = await documentSumittedSuccessfully(
        userExist.name,
        userExist.email,
        frontendUrl
      );
      await SendBrevoMail(
        "Document Submitted Successfully",
        [{ name: userExist.name, email: userExist.email }],
        html
      );
    }

    // Create document
    const document = await new Document({
      ...req.body,
      userId,
    }).save();

    return res.status(201).json({
      message: "Document Created",
      data: document,
    });
  } catch (error) {
    console.error("ADD DOCUMENT ERROR:", error);
    next(error);
  }
};

/**
 * ============================================================
 * GET DOCUMENT BY LOGGED-IN USER
 * ============================================================
 */
export const getDocumentByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user?.userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const userId = req.user.userId;

    const document = await Document.find({
      userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (document.length === 0) {
      return res.status(200).json({
        message: "No documents found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Documents found",
      data: document,
    });
  } catch (error) {
    console.error("GET DOCUMENT BY USER ERROR:", error);
    next(error);
  }
};

/**
 * ============================================================
 * GET DOCUMENT BY ID
 * ============================================================
 */
export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Valid document ID is required" });
    }

    const document = await Document.findById(req.params.id).lean().exec();

    if (!document) {
      return res.status(404).json({ message: "Document does not exist" });
    }

    return res.status(200).json({
      message: "Document found",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================================================
 * UPDATE DOCUMENT BY ID
 * ============================================================
 */
export const updateDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Valid document ID is required" });
    }

    const existingDoc = await Document.findById(req.params.id).lean().exec();
    if (!existingDoc) {
      return res.status(404).json({ message: "Document does not exist" });
    }

    // Process all base64 files for update
    const fileFields = [
      'groomAadharFront', 'groomAadharBack',
      'groomVoterIdFront', 'groomVoterIdBack',
      'groomPassportFront', 'groomPassportBack',
      'groomBirthCertificateImage',
      'brideAadharFront', 'brideAadharBack',
      'brideOtherProofImage', 'brideBirthProofImage',
      'marriageProofPhoto', 'marriageProofCoupleImage', 'marriageProofInvitation',
      'religiousCertificateImage',
      'witness1AadharFront', 'witness1AadharBack', 'witness1PanCardPhoto',
      'witness2AadharFront', 'witness2AadharBack', 'witness2PanCardPhoto',
      'signatureImageGroom', 'signatureImageBride',
      'signatureImageWitness1', 'signatureImageWitness2',
    ];

    for (const field of fileFields) {
      await updateBase64File(field, req.body, existingDoc);
    }

    // Send verification/rejection emails
    const userExist = await User.findById(existingDoc.userId).lean().exec();

    if (userExist?.name && userExist?.email) {
      if (req.body?.isDocumentVerified) {
        const html = await successfullDocumentVerification(userExist.name);
        await SendBrevoMail(
          "Document Verified Successfully",
          [{ name: userExist.name, email: userExist.email }],
          html
        );
      } else if (!req.body?.isDocumentVerified && req.body?.remark) {
        const frontendUrl = `${process.env.FRONTEND_URL}/document`;
        const html = await documentRejectionAndReUpload(
          req.body.remark,
          userExist.name,
          frontendUrl
        );
        await SendBrevoMail(
          "Document Rejected",
          [{ name: userExist.name, email: userExist.email }],
          html
        );
      }
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean().exec();

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document does not exist" });
    }

    return res.status(200).json({
      message: "Document Updated",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("UPDATE DOCUMENT ERROR:", error);
    next(error);
  }
};

/**
 * ============================================================
 * GET ALL DOCUMENTS (Admin)
 * ============================================================
 */
export const getAllDocument = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    });

    if (req.query.query && req.query.query !== "") {
      const searchRegex = new RegExp(req.query.query, "i");
      pipeline.push({
        $match: {
          $or: [
            { "user.name": searchRegex },
          ],
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        userName: { $ifNull: ["$user.name", "Unknown User"] },
        isDeleted: 1,
        isDocumentVerified: 1,
        createdAt: 1,
      },
    });

    const DocumentArr = await paginateAggregate(Document, pipeline, req.query);

    return res.status(200).json({
      message: "Found all Documents",
      data: DocumentArr.data,
      total: DocumentArr.total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================================================
 * GET DOCUMENT BY USER ID
 * ============================================================
 */
export const getDocumentByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid user ID is required" });
    }

    const document = await Document.find({
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (document.length === 0) {
      return res.status(200).json({
        message: "No documents found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Documents found",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================================================
 * DELETE DOCUMENT BY ID
 * ============================================================
 */
export const deleteDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Valid document ID is required" });
    }

    const existsCheck = await Document.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).exec();

    if (!existsCheck) {
      return res.status(404).json({
        message: "Document does not exist or already deleted",
      });
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();

    return res.status(200).json({
      message: "Document Deleted Successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error);
    next(error);
  }
};