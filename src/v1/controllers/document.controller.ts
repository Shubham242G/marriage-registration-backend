import { NextFunction, Request, Response } from "express";
import mongoose, { PipelineStage } from "mongoose";

import { paginateAggregate } from "@helpers/paginateAggregate";
import {
  deleteFile,
  storeFileAndReturnNameBase64,
} from "@helpers/fileSystem";

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
 * ADD DOCUMENT
 * ============================================================
 */
export const addDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("========================================");
    console.log("ADD DOCUMENT API CALLED");
    console.log("USER:", req.user?.userId);
    console.log("BODY KEYS:", Object.keys(req.body || {}));
    console.log("========================================");

    if (!req?.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const userId = req.user.userId;

    /**
     * Check whether document already exists
     */
    const existsCheck = await Document.findOne({
      userId,
      isDeleted: false,
    })
      .lean()
      .exec();

    if (existsCheck) {
      return res.status(400).json({
        message: "Document already exists With same User",
      });
    }

    /**
     * ========================================================
     * HELPER FOR BASE64 FILES
     * ========================================================
     */
    const saveBase64File = async (fieldName: string) => {
      const value = req.body?.[fieldName];

      if (
        value &&
        typeof value === "string" &&
        value.includes("base64")
      ) {
        req.body[fieldName] =
          await storeFileAndReturnNameBase64(value);
      }
    };

    /**
     * ========================================================
     * EXISTING DOCUMENT FILES
     * ========================================================
     */

    await saveBase64File("groomAadharFront");
    await saveBase64File("groomAadharBack");
    await saveBase64File("groomOtherProofImage");
    await saveBase64File("groomBirthProofImage");

    await saveBase64File("brideAadharFront");
    await saveBase64File("brideAadharBack");
    await saveBase64File("brideOtherProofImage");
    await saveBase64File("brideBirthProofImage");

    /**
     * ========================================================
     * WITNESS 1
     * ========================================================
     */

    await saveBase64File("witness1AadharFront");
    await saveBase64File("witness1AadharBack");
    await saveBase64File("witness1OtherProofImage");
    await saveBase64File("witness1PassportPhoto");
    await saveBase64File("witness1PanCardPhoto");
    await saveBase64File("signatureImageWitness1");
    await saveBase64File("additionalDocumentWitness1ProofImage");

    /**
     * ========================================================
     * WITNESS 2
     * ========================================================
     */

    await saveBase64File("witness2AadharFront");
    await saveBase64File("witness2AadharBack");
    await saveBase64File("witness2OtherProofImage");
    await saveBase64File("witness2PassportPhoto");
    await saveBase64File("witness2PanCardPhoto");
    await saveBase64File("signatureImageWitness2");
    await saveBase64File("additionalDocumentWitness2ProofImage");

    /**
     * ========================================================
     * WITNESS 3
     * ========================================================
     */

    await saveBase64File("witness3AadharFront");
    await saveBase64File("witness3AadharBack");
    await saveBase64File("witness3OtherProofImage");
    await saveBase64File("witness3PassportPhoto");
    await saveBase64File("witness3PanCardPhoto");
    await saveBase64File("signatureImageWitness3");
    await saveBase64File("additionalDocumentWitness3ProofImage");

    /**
     * ========================================================
     * MARRIAGE PROOFS
     * ========================================================
     */

    await saveBase64File("marriageProofVarmala");
    await saveBase64File("marriageProofPhera");
    await saveBase64File("marriageProofInvitation");
    await saveBase64File("marriageProofPhoto");
    await saveBase64File("marriageProofCoupleImage");

    /**
     * ========================================================
     * SIGNATURES
     * ========================================================
     */

    await saveBase64File("signatureImageBride");
    await saveBase64File("signatureImageGroom");

    /**
     * ========================================================
     * FAMILY ID
     * ========================================================
     */

    await saveBase64File("groomFamilyIdImage");
    await saveBase64File("brideFamilyIdImage");

    /**
     * ========================================================
     * ADDITIONAL DOCUMENTS
     * ========================================================
     */

    await saveBase64File("additionalDocumentProofImage");
    await saveBase64File("additionalDocumentBrideProofImage");

    /**
     * ========================================================
     * PARENT AADHAR
     * ========================================================
     */

    await saveBase64File("parentAadharMomFrontSide");
    await saveBase64File("parentAadharMomBackSide");
    await saveBase64File("parentAadharDadFrontSide");
    await saveBase64File("parentAadharDadBackSide");

    /**
     * ========================================================
     * BRIDE PASSPORT
     * ========================================================
     */

    await saveBase64File("bridePassportPhoto");
    await saveBase64File("bridePassportFrontImage");
    await saveBase64File("bridePassportBackImage");

    /**
     * ========================================================
     * BRIDE DRIVING LICENSE
     * ========================================================
     */

    await saveBase64File("brideDrivingLicenseFrontImage");
    await saveBase64File("brideDrivingLicenseBackImage");

    /**
     * ========================================================
     * BRIDE VOTER ID
     * ========================================================
     */

    await saveBase64File("brideVoterIdFrontImage");
    await saveBase64File("brideVoterIdBackImage");

    /**
     * ========================================================
     * BRIDE INVITATION / PHOTO
     * ========================================================
     */

    await saveBase64File("brideInvitationCardImage");
    await saveBase64File("bridePPSizePhoto");

    /**
     * ========================================================
     * BRIDE PARENTS AADHAR
     * ========================================================
     */

    await saveBase64File("brideParentsAadhar");
    await saveBase64File("brideParentsAadharBack");

    /**
     * ========================================================
     * BRIDE PARENT AADHAR - SECOND SET
     * ========================================================
     */

    await saveBase64File("ParentAadharDadFrontSideBride");
    await saveBase64File("ParentAadharDadBackSideBride");
    await saveBase64File("ParentAadharMomFrontSideBride");
    await saveBase64File("ParentAadharMomBackSideBride");

    await saveBase64File("FamilyIdImageBride");
    await saveBase64File("brideOtherIdProofImage");

    /**
     * ========================================================
     * NEW GROOM DOCUMENTS
     * ========================================================
     */

    await saveBase64File("groomVoterIdFront");
    await saveBase64File("groomVoterIdBack");

    await saveBase64File("groomPassportFront");
    await saveBase64File("groomPassportBack");

    await saveBase64File("groomBirthCertificateImage");

    /**
     * ========================================================
     * RELIGIOUS CERTIFICATE
     * ========================================================
     */

    await saveBase64File("religiousCertificateImage");

    /**
     * ========================================================
     * LOG BEFORE SAVE
     * ========================================================
     */

    console.log("========================================");
    console.log("ABOUT TO SAVE DOCUMENT");
    console.log("USER ID:", userId);
    console.log("BODY KEYS AFTER FILE PROCESSING:");
    console.log(Object.keys(req.body || {}));
    console.log("========================================");

    /**
     * ========================================================
     * USER CHECK
     * ========================================================
     */

    const userExist = await User.findById(userId)
      .lean()
      .exec();

    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /**
     * ========================================================
     * SEND SUBMISSION EMAIL
     * ========================================================
     */

    if (userExist.name && userExist.email) {
      const frontendUrl =
        `${process.env.FRONTEND_URL}/document`;

      const html = await documentSumittedSuccessfully(
        userExist.name,
        userExist.email,
        frontendUrl
      );

      await SendBrevoMail(
        "Document Sumitted Successfully",
        [
          {
            name: userExist.name,
            email: userExist.email,
          },
        ],
        html
      );
    }

    /**
     * ========================================================
     * CREATE DOCUMENT
     * ========================================================
     */

    const document = await new Document({
      ...req.body,
      userId,
    }).save();

    /**
     * ========================================================
     * IMPORTANT DEBUG LOGS
     * ========================================================
     */

    console.log("========================================");
    console.log("DOCUMENT SUCCESSFULLY SAVED");
    console.log("DOCUMENT ID:", document._id);
    console.log("DOCUMENT USER ID:", document.userId);
    console.log("DOCUMENT IS DELETED:", document.isDeleted);
    console.log("========================================");

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
 * GET ALL DOCUMENTS
 * ============================================================
 */
export const getAllDocument = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const pipeline: PipelineStage[] = [];

    const matchObj: Record<string, any> = {};

    /**
     * Lookup user
     */
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });

    /**
     * Unwind user
     */
    pipeline.push({
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    });

    /**
     * Search
     */
    if (req.query.query && req.query.query !== "") {
      const searchRegex = new RegExp(
        req.query.query,
        "i"
      );

      matchObj.$or = [
        {
          emailId: searchRegex,
        },
        {
          mobileNumber: searchRegex,
        },
        {
          "user.name": searchRegex,
        },
      ];
    }

    pipeline.push({
      $match: matchObj,
    });

    /**
     * Project
     */
    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        emailId: 1,
        mobileNumber: 1,
        userName: {
          $ifNull: ["$user.name", "Unknown User"],
        },
        isDeleted: 1,
      },
    });

    const DocumentArr = await paginateAggregate(
      Document,
      pipeline,
      req.query
    );

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
 * GET DOCUMENT BY LOGGED-IN USER
 * ============================================================
 */
export const getDocumentByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * Check authentication
     */
    if (!req?.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const userId = req.user.userId;

    console.log("========================================");
    console.log("GET DOCUMENT BY USER");
    console.log("USER ID:", userId);
    console.log("========================================");

    /**
     * Find documents
     */
    const document = await Document.find({
      userId,
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .lean()
      .exec();

    console.log("DOCUMENTS FOUND:", document.length);
    console.log("DOCUMENT DATA:", document);

    /**
     * IMPORTANT:
     *
     * Document.find() returns an array.
     *
     * [] is truthy in JavaScript.
     *
     * Therefore:
     *
     * if (!document)
     *
     * is WRONG.
     */
    if (document.length === 0) {
      return res.status(200).json({
        message: "No documents found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Document Images found",
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
    if (
      !req.params.id ||
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        message: "Valid document ID is required",
      });
    }

    const document = await Document.findById(
      req.params.id
    )
      .lean()
      .exec();

    if (!document) {
      return res.status(404).json({
        message: "Document does not exist",
      });
    }

    return res.status(200).json({
      message: "Found specific Document",
      data: document,
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

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Valid user ID is required",
      });
    }

    console.log(
      "GET DOCUMENT BY USER ID:",
      userId
    );

    const document = await Document.find({
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .lean()
      .exec();

    console.log(
      "DOCUMENTS FOUND:",
      document.length
    );

    if (document.length === 0) {
      return res.status(200).json({
        message: "No documents found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Found specific Documents",
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
    if (
      !req.params.id ||
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        message: "Valid document ID is required",
      });
    }

    /**
     * Find existing document
     */
    const existsCheck = await Document.findById(
      req.params.id
    )
      .lean()
      .exec();

    if (!existsCheck) {
      return res.status(404).json({
        message: "Document does not exist",
      });
    }

    /**
     * ========================================================
     * FILE UPDATE HELPER
     * ========================================================
     */

    const updateBase64File = async (
      fieldName: string
    ) => {
      const newValue = req.body?.[fieldName];

      if (
        newValue &&
        typeof newValue === "string" &&
        newValue.includes("base64")
      ) {
        const oldValue = (existsCheck as any)?.[
          fieldName
        ];

        if (oldValue) {
          await deleteFile(oldValue);
        }

        req.body[fieldName] =
          await storeFileAndReturnNameBase64(
            newValue
          );
      }
    };

    /**
     * ========================================================
     * EXISTING FILES
     * ========================================================
     */

    await updateBase64File("groomAadharFront");
    await updateBase64File("groomAadharBack");
    await updateBase64File("groomOtherProofImage");
    await updateBase64File("groomBirthProofImage");

    await updateBase64File("brideAadharFront");
    await updateBase64File("brideAadharBack");
    await updateBase64File("brideOtherProofImage");
    await updateBase64File("brideBirthProofImage");

    /**
     * Witness 1
     */
    await updateBase64File("witness1AadharFront");
    await updateBase64File("witness1AadharBack");
    await updateBase64File("witness1OtherProofImage");
    await updateBase64File("witness1PassportPhoto");
    await updateBase64File("witness1PanCardPhoto");
    await updateBase64File("signatureImageWitness1");
    await updateBase64File(
      "additionalDocumentWitness1ProofImage"
    );

    /**
     * Witness 2
     */
    await updateBase64File("witness2AadharFront");
    await updateBase64File("witness2AadharBack");
    await updateBase64File("witness2OtherProofImage");
    await updateBase64File("witness2PassportPhoto");
    await updateBase64File("witness2PanCardPhoto");
    await updateBase64File("signatureImageWitness2");
    await updateBase64File(
      "additionalDocumentWitness2ProofImage"
    );

    /**
     * Witness 3
     */
    await updateBase64File("witness3AadharFront");
    await updateBase64File("witness3AadharBack");
    await updateBase64File("witness3OtherProofImage");
    await updateBase64File("witness3PassportPhoto");
    await updateBase64File("witness3PanCardPhoto");
    await updateBase64File("signatureImageWitness3");
    await updateBase64File(
      "additionalDocumentWitness3ProofImage"
    );

    /**
     * Marriage proofs
     */
    await updateBase64File("marriageProofVarmala");
    await updateBase64File("marriageProofPhera");
    await updateBase64File("marriageProofInvitation");
    await updateBase64File("marriageProofPhoto");
    await updateBase64File(
      "marriageProofCoupleImage"
    );

    /**
     * Signatures
     */
    await updateBase64File("signatureImageBride");
    await updateBase64File("signatureImageGroom");

    /**
     * Family IDs
     */
    await updateBase64File("groomFamilyIdImage");
    await updateBase64File("brideFamilyIdImage");

    /**
     * Additional documents
     */
    await updateBase64File(
      "additionalDocumentProofImage"
    );

    await updateBase64File(
      "additionalDocumentBrideProofImage"
    );

    /**
     * Parents
     */
    await updateBase64File(
      "parentAadharMomFrontSide"
    );

    await updateBase64File(
      "parentAadharMomBackSide"
    );

    await updateBase64File(
      "parentAadharDadFrontSide"
    );

    await updateBase64File(
      "parentAadharDadBackSide"
    );

    /**
     * Bride passport
     */
    await updateBase64File("bridePassportPhoto");
    await updateBase64File(
      "bridePassportFrontImage"
    );

    await updateBase64File(
      "bridePassportBackImage"
    );

    /**
     * Bride driving license
     */
    await updateBase64File(
      "brideDrivingLicenseFrontImage"
    );

    await updateBase64File(
      "brideDrivingLicenseBackImage"
    );

    /**
     * Bride voter ID
     */
    await updateBase64File(
      "brideVoterIdFrontImage"
    );

    await updateBase64File(
      "brideVoterIdBackImage"
    );

    /**
     * Bride invitation/photo
     */
    await updateBase64File(
      "brideInvitationCardImage"
    );

    await updateBase64File(
      "bridePPSizePhoto"
    );

    /**
     * Bride parents
     */
    await updateBase64File(
      "brideParentsAadhar"
    );

    await updateBase64File(
      "brideParentsAadharBack"
    );

    /**
     * Bride parent Aadhar
     */
    await updateBase64File(
      "ParentAadharDadFrontSideBride"
    );

    await updateBase64File(
      "ParentAadharDadBackSideBride"
    );

    await updateBase64File(
      "ParentAadharMomFrontSideBride"
    );

    await updateBase64File(
      "ParentAadharMomBackSideBride"
    );

    await updateBase64File(
      "FamilyIdImageBride"
    );

    await updateBase64File(
      "brideOtherIdProofImage"
    );

    /**
     * ========================================================
     * NEW GROOM DOCUMENTS
     * ========================================================
     */

    await updateBase64File(
      "groomVoterIdFront"
    );

    await updateBase64File(
      "groomVoterIdBack"
    );

    await updateBase64File(
      "groomPassportFront"
    );

    await updateBase64File(
      "groomPassportBack"
    );

    await updateBase64File(
      "groomBirthCertificateImage"
    );

    /**
     * ========================================================
     * RELIGIOUS CERTIFICATE
     * ========================================================
     */

    await updateBase64File(
      "religiousCertificateImage"
    );

    /**
     * ========================================================
     * USER
     * ========================================================
     */

    const userId =
      (req.body?.userId as string) ||
      (existsCheck as any)?.userId?.toString();

    const userExistEmailCheck = userId
      ? await User.findById(userId)
          .lean()
          .exec()
      : null;

    console.log(
      "UserExistEmailCheck:",
      userExistEmailCheck
    );

    /**
     * ========================================================
     * EMAILS
     * ========================================================
     */

    if (
      userExistEmailCheck &&
      userExistEmailCheck.name &&
      userExistEmailCheck.email
    ) {
      /**
       * Document verified
       */
      if (req.body?.isDocumentVerified) {
        const html =
          await successfullDocumentVerification(
            userExistEmailCheck.name
          );

        await SendBrevoMail(
          "Document Verified Successfully",
          [
            {
              name: userExistEmailCheck.name,
              email: userExistEmailCheck.email,
            },
          ],
          html
        );
      }

      /**
       * Document rejected
       */
      else if (
        !req.body?.isDocumentVerified &&
        req.body?.remark
      ) {
        const frontendUrl =
          `${process.env.FRONTEND_URL}/document`;

        const html =
          await documentRejectionAndReUpload(
            req.body.remark,
            userExistEmailCheck.name,
            frontendUrl
          );

        await SendBrevoMail(
          "Document Rejected",
          [
            {
              name: userExistEmailCheck.name,
              email: userExistEmailCheck.email,
            },
          ],
          html
        );
      }
    }

    /**
     * ========================================================
     * UPDATE DOCUMENT
     * ========================================================
     */

    const updatedDocument =
      await Document.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .lean()
        .exec();

    if (!updatedDocument) {
      return res.status(404).json({
        message: "Document does not exist",
      });
    }

    console.log(
      "DOCUMENT UPDATED:",
      updatedDocument._id
    );

    return res.status(200).json({
      message: "Document Updated",
      data: updatedDocument,
    });
  } catch (error) {
    console.error(
      "UPDATE DOCUMENT ERROR:",
      error
    );

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
    if (
      !req.params.id ||
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Valid document ID is required",
      });
    }

    const existsCheck =
      await Document.findOne({
        _id: req.params.id,
        isDeleted: false,
      }).exec();

    if (!existsCheck) {
      return res.status(404).json({
        message:
          "Document does not exist or already deleted",
      });
    }

    const updatedDocument =
      await Document.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            isDeleted: true,
          },
        },
        {
          new: true,
        }
      ).exec();

    if (!updatedDocument) {
      return res.status(404).json({
        message: "Failed to delete document",
      });
    }

    return res.status(200).json({
      message: "Document Deleted Successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error(
      "DELETE DOCUMENT ERROR:",
      error
    );

    next(error);
  }
};