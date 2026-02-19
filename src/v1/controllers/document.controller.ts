import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import {
  deleteFile,
  deleteFileUsingUrl,
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

//     try {
//       if (req.body.image && req.body.image.includes("base64")) {
//         req.body.image = await storeFileAndReturnNameBase64(req.body.image);
//       }
//       if (req.body.fullImage && req.body.fullImage.includes("base64")) {
//         req.body.fullImage = await storeFileAndReturnNameBase64(req.body.fullImage);
//       }

//       if (req.body.galleryFilesArr && req.body.galleryFilesArr.length > 0) {
//         for (const el of req.body.galleryFilesArr) {
//           if (el.filename.includes("base64")) {
//             el.filename = await storeFileAndReturnNameBase64(el.filename);
//           }
//           else{
//             el.filename = el.filename
//           }
//           if ( el.fullImage && el.fullImage.includes("base64")) {
//             el.fullFilename = await storeFileAndReturnNameBase64(el.fullImage);
//           }
//           else{
//             el.fullFilename = el.fullImage
//           }
//         }
//       }
//       if (req.body.lastFilesArr && req.body.lastFilesArr.length > 0) {
//         for (const el of req.body.lastFilesArr) {
//           if (el.filename.includes("base64")) {
//             el.filename = await storeFileAndReturnNameBase64(el.filename);
//           }
//           else{
//             el.filename = el.filename
//           }
//           if ( el.fullImage && el.fullImage.includes("base64")) {
//             el.fullFilename = await storeFileAndReturnNameBase64(el.fullImage);
//           }
//           else{
//             el.fullFilename = el.fullImage
//           }
//         }
//       }
//       if (req.body.featuredInArr && req.body.featuredInArr.length > 0) {
//         for (const el of req.body.featuredInArr) {
//           if (el.filename.includes("base64")) {
//             el.filename = await storeFileAndReturnNameBase64(el.filename);
//           }
//           else{
//             el.filename = el.filename
//           }
//           if ( el.fullImage && el.fullImage.includes("base64")) {
//             el.fullFilename = await storeFileAndReturnNameBase64(el.fullImage);
//           }
//           else{
//             el.fullFilename = el.fullImage
//           }
//         }
//       }

//       const existsCheck = await About.findOne().exec();

//       if (existsCheck) {
//         await About.findByIdAndUpdate(existsCheck?._id, req.body).exec();
//       } else {
//         await new About(req.body).save();
//       }

//       res.status(201).json({ message: "About" });
//     } catch (error) {
//       next(error);
//     }
//   };

export const addDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Document.findOne({
      userId: req?.user?.userId,
      isDeleted: false,
    }).exec();
    if (existsCheck) {
      // throw new Error("Document already exists With same User");
      return res
        .status(400)
        .json({ message: "Document already exists With same User" });
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }

    if (
      req?.body?.groomAadharFront &&
      req.body.groomAadharFront.includes("base64")
    ) {
      req.body.groomAadharFront = await storeFileAndReturnNameBase64(
        req.body.groomAadharFront
      );
    }
    if (
      req?.body?.groomAadharBack &&
      req.body.groomAadharBack.includes("base64")
    ) {
      req.body.groomAadharBack = await storeFileAndReturnNameBase64(
        req.body.groomAadharBack
      );
    }
    if (
      req?.body?.groomOtherProofImage &&
      req.body.groomOtherProofImage.includes("base64")
    ) {
      req.body.groomOtherProofImage = await storeFileAndReturnNameBase64(
        req.body.groomOtherProofImage
      );
    }
    if (
      req?.body?.groomBirthProofImage &&
      req.body.groomBirthProofImage.includes("base64")
    ) {
      req.body.groomBirthProofImage = await storeFileAndReturnNameBase64(
        req.body.groomBirthProofImage
      );
    }
    if (
      req?.body?.brideAadharFront &&
      req.body.brideAadharFront.includes("base64")
    ) {
      req.body.brideAadharFront = await storeFileAndReturnNameBase64(
        req.body.brideAadharFront
      );
    }
    if (
      req?.body?.brideAadharBack &&
      req.body.brideAadharBack.includes("base64")
    ) {
      req.body.brideAadharBack = await storeFileAndReturnNameBase64(
        req.body.brideAadharBack
      );
    }
    if (
      req?.body?.brideOtherProofImage &&
      req.body.brideOtherProofImage.includes("base64")
    ) {
      req.body.brideOtherProofImage = await storeFileAndReturnNameBase64(
        req.body.brideOtherProofImage
      );
    }
    if (
      req?.body?.brideBirthProofImage &&
      req.body.brideBirthProofImage.includes("base64")
    ) {
      req.body.brideBirthProofImage = await storeFileAndReturnNameBase64(
        req.body.brideBirthProofImage
      );
    }
    if (
      req?.body?.witness1AadharFront &&
      req.body.witness1AadharFront.includes("base64")
    ) {
      req.body.witness1AadharFront = await storeFileAndReturnNameBase64(
        req.body.witness1AadharFront
      );
    }
    if (
      req?.body?.witness1AadharBack &&
      req.body.witness1AadharBack.includes("base64")
    ) {
      req.body.witness1AadharBack = await storeFileAndReturnNameBase64(
        req.body.witness1AadharBack
      );
    }
    if (
      req?.body?.witness1OtherProofImage &&
      req.body.witness1OtherProofImage.includes("base64")
    ) {
      req.body.witness1OtherProofImage = await storeFileAndReturnNameBase64(
        req.body.witness1OtherProofImage
      );
    }
    if (
      req?.body?.witness2AadharFront &&
      req.body.witness2AadharFront.includes("base64")
    ) {
      req.body.witness2AadharFront = await storeFileAndReturnNameBase64(
        req.body.witness2AadharFront
      );
    }
    if (
      req?.body?.witness2AadharBack &&
      req.body.witness2AadharBack.includes("base64")
    ) {
      req.body.witness2AadharBack = await storeFileAndReturnNameBase64(
        req.body.witness2AadharBack
      );
    }
    if (
      req?.body?.witness2OtherProofImage &&
      req.body.witness2OtherProofImage.includes("base64")
    ) {
      req.body.witness2OtherProofImage = await storeFileAndReturnNameBase64(
        req.body.witness2OtherProofImage
      );
    }
    if (
      req?.body?.witness3AadharFront &&
      req.body.witness3AadharFront.includes("base64")
    ) {
      req.body.witness3AadharFront = await storeFileAndReturnNameBase64(
        req.body.witness3AadharFront
      );
    }
    if (
      req?.body?.witness3AadharBack &&
      req.body.witness3AadharBack.includes("base64")
    ) {
      req.body.witness3AadharBack = await storeFileAndReturnNameBase64(
        req.body.witness3AadharBack
      );
    }
    if (
      req?.body?.witness3OtherProofImage &&
      req.body.witness3OtherProofImage.includes("base64")
    ) {
      req.body.witness3OtherProofImage = await storeFileAndReturnNameBase64(
        req.body.witness3OtherProofImage
      );
    }
    if (
      req?.body?.marriageProofVarmala &&
      req.body.marriageProofVarmala.includes("base64")
    ) {
      req.body.marriageProofVarmala = await storeFileAndReturnNameBase64(
        req.body.marriageProofVarmala
      );
    }
    if (
      req?.body?.marriageProofPhera &&
      req.body.marriageProofPhera.includes("base64")
    ) {
      req.body.marriageProofPhera = await storeFileAndReturnNameBase64(
        req.body.marriageProofPhera
      );
    }
    if (
      req?.body?.marriageProofInvitation &&
      req.body.marriageProofInvitation.includes("base64")
    ) {
      req.body.marriageProofInvitation = await storeFileAndReturnNameBase64(
        req.body.marriageProofInvitation
      );
    }
    if (
      req?.body?.marriageProofPhoto &&
      req.body.marriageProofPhoto.includes("base64")
    ) {
      req.body.marriageProofPhoto = await storeFileAndReturnNameBase64(
        req.body.marriageProofPhoto
      );
    }
    if (
      req?.body?.bridePassportPhoto &&
      req?.body?.bridePassportPhoto.includes("base64")
    ) {
      req.body.bridePassportPhoto = await storeFileAndReturnNameBase64(
        req.body.bridePassportPhoto
      );
    }

    if (
      req?.body?.witness1PassportPhoto &&
      req.body.witness1PassportPhoto.includes("base64")
    ) {
      req.body.witness1PassportPhoto = await storeFileAndReturnNameBase64(
        req.body.witness1PassportPhoto
      );
    }
    if (
      req?.body?.witness1PanCardPhoto &&
      req.body.witness1PanCardPhoto.includes("base64")
    ) {
      req.body.witness1PanCardPhoto = await storeFileAndReturnNameBase64(
        req.body.witness1PanCardPhoto
      );
    }

    if (
      req?.body?.witness2PassportPhoto &&
      req.body.witness2PassportPhoto.includes("base64")
    ) {
      req.body.witness2PassportPhoto = await storeFileAndReturnNameBase64(
        req.body.witness2PassportPhoto
      );
    }
    if (
      req?.body?.witness2PanCardPhoto &&
      req.body.witness2PanCardPhoto.includes("base64")
    ) {
      req.body.witness2PanCardPhoto = await storeFileAndReturnNameBase64(
        req.body.witness2PanCardPhoto
      );
    }
    if (
      req?.body?.witness3PassportPhoto &&
      req.body.witness3PassportPhoto.includes("base64")
    ) {
      req.body.witness3PassportPhoto = await storeFileAndReturnNameBase64(
        req.body.witness3PassportPhoto
      );
    }
    if (
      req?.body?.witness3PanCardPhoto &&
      req.body.witness3PanCardPhoto.includes("base64")
    ) {
      req.body.witness3PanCardPhoto = await storeFileAndReturnNameBase64(
        req.body.witness3PanCardPhoto
      );
    }

    if (
      req?.body?.signatureImageBride &&
      req.body.signatureImageBride.includes("base64")
    ) {
      req.body.signatureImageBride = await storeFileAndReturnNameBase64(
        req.body.signatureImageBride
      );
    }

    if (
      req?.body?.signatureImageGroom &&
      req.body.signatureImageGroom.includes("base64")
    ) {
      req.body.signatureImageGroom = await storeFileAndReturnNameBase64(
        req.body.signatureImageGroom
      );
    }

    if (
      req?.body?.signatureImageWitness1 &&
      req.body.signatureImageWitness1.includes("base64")
    ) {
      req.body.signatureImageWitness1 = await storeFileAndReturnNameBase64(
        req.body.signatureImageWitness1
      );
    }

    if (
      req?.body?.signatureImageWitness2 &&
      req.body.signatureImageWitness2.includes("base64")
    ) {
      req.body.signatureImageWitness2 = await storeFileAndReturnNameBase64(
        req.body.signatureImageWitness2
      );
    }

    if (
      req?.body?.signatureImageWitness3 &&
      req.body.signatureImageWitness3.includes("base64")
    ) {
      req.body.signatureImageWitness3 = await storeFileAndReturnNameBase64(
        req.body.signatureImageWitness3
      );
    }

    if (
      req?.body?.groomFamilyIdImage &&
      req.body.groomFamilyIdImage.includes("base64")
    ) {
      req.body.groomFamilyIdImage = await storeFileAndReturnNameBase64(
        req.body.groomFamilyIdImage
      );
    }

    if (
      req?.body?.brideFamilyIdImage &&
      req.body.brideFamilyIdImage.includes("base64")
    ) {
      req.body.brideFamilyIdImage = await storeFileAndReturnNameBase64(
        req.body.brideFamilyIdImage
      );
    }

    if (
      req?.body?.additionalDocumentProofImage &&
      req.body.additionalDocumentProofImage.includes("base64")
    ) {
      req.body.additionalDocumentProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentProofImage
        );
    }

    if (
      req?.body?.additionalDocumentBrideProofImage &&
      req.body.additionalDocumentBrideProofImage.includes("base64")
    ) {
      req.body.additionalDocumentBrideProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentBrideProofImage
        );
    }

    if (
      req?.body?.coupleImageWhiteBackground &&
      req.body.coupleImageWhiteBackground.includes("base64")
    ) {
      req.body.coupleImageWhiteBackground = await storeFileAndReturnNameBase64(
        req.body.coupleImageWhiteBackground
      );
    }

    if (
      req?.body?.parentAadharMomFrontSide &&
      req.body.parentAadharMomFrontSide.includes("base64")
    ) {
      req.body.parentAadharMomFrontSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharMomFrontSide
      );
    }

    if (
      req?.body?.parentAadharMomBackSide &&
      req.body.parentAadharMomBackSide.includes("base64")
    ) {
      req.body.parentAadharMomBackSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharMomBackSide
      );
    }

    if (
      req?.body?.parentAadharDadFrontSide &&
      req.body.parentAadharDadFrontSide.includes("base64")
    ) {
      req.body.parentAadharDadFrontSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharDadFrontSide
      );
    }

    if (
      req?.body?.parentAadharDadBackSide &&
      req.body.parentAadharDadBackSide.includes("base64")
    ) {
      req.body.parentAadharDadBackSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharDadBackSide
      );
    }

    if (
      req?.body?.bridePassportFrontImage &&
      req.body.bridePassportFrontImage.includes("base64")
    ) {
      req.body.bridePassportFrontImage = await storeFileAndReturnNameBase64(
        req.body.bridePassportFrontImage
      );
    }

    if (
      req?.body?.bridePassportBackImage &&
      req.body.bridePassportBackImage.includes("base64")
    ) {
      req.body.bridePassportBackImage = await storeFileAndReturnNameBase64(
        req.body.bridePassportBackImage
      );
    }

    if (
      req?.body?.brideDrivingLicenseFrontImage &&
      req.body.brideDrivingLicenseFrontImage.includes("base64")
    ) {
      req.body.brideDrivingLicenseFrontImage =
        await storeFileAndReturnNameBase64(
          req.body.brideDrivingLicenseFrontImage
        );
    }

    if (
      req?.body?.brideDrivingLicenseBackImage &&
      req.body.brideDrivingLicenseBackImage.includes("base64")
    ) {
      req.body.brideDrivingLicenseBackImage =
        await storeFileAndReturnNameBase64(
          req.body.brideDrivingLicenseBackImage
        );
    }

    if (
      req?.body?.brideVoterIdFrontImage &&
      req.body.brideVoterIdFrontImage.includes("base64")
    ) {
      req.body.brideVoterIdFrontImage = await storeFileAndReturnNameBase64(
        req.body.brideVoterIdFrontImage
      );
    }

    if (
      req?.body?.brideVoterIdBackImage &&
      req.body.brideVoterIdBackImage.includes("base64")
    ) {
      req.body.brideVoterIdBackImage = await storeFileAndReturnNameBase64(
        req.body.brideVoterIdBackImage
      );
    }

    if (
      req?.body?.brideInvitationCardImage &&
      req.body.brideInvitationCardImage.includes("base64")
    ) {
      req.body.brideInvitationCardImage = await storeFileAndReturnNameBase64(
        req.body.brideInvitationCardImage
      );
    }

    if (
      req?.body?.bridePPSizePhoto &&
      req.body.bridePPSizePhoto.includes("base64")
    ) {
      req.body.bridePPSizePhoto = await storeFileAndReturnNameBase64(
        req.body.bridePPSizePhoto
      );
    }

    if (
      req?.body?.brideParentsAadhar &&
      req.body.brideParentsAadhar.includes("base64")
    ) {
      req.body.brideParentsAadhar = await storeFileAndReturnNameBase64(
        req.body.brideParentsAadhar
      );
    }

    if (
      req?.body?.brideParentsAadharBack &&
      req.body.brideParentsAadharBack.includes("base64")
    ) {
      req.body.brideParentsAadharBack = await storeFileAndReturnNameBase64(
        req.body.brideParentsAadharBack
      );
    }

    if (
      req.body.additionalDocumentWitness1ProofImage &&
      req.body.additionalDocumentWitness1ProofImage.includes("base64")
    ) {
      req.body.additionalDocumentWitness1ProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentWitness1ProofImage
        );
    }

    if (
      req.body.additionalDocumentWitness2ProofImage &&
      req.body.additionalDocumentWitness2ProofImage.includes("base64")
    ) {
      req.body.additionalDocumentWitness2ProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentWitness2ProofImage
        );
    }

    if (
      req.body.additionalDocumentWitness3ProofImage &&
      req.body.additionalDocumentWitness3ProofImage.includes("base64")
    ) {
      req.body.additionalDocumentWitness3ProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentWitness3ProofImage
        );
    }
    if (
      req.body.marriageProofCoupleImage &&
      req.body.marriageProofCoupleImage.includes("base64")
    ) {
      req.body.marriageProofCoupleImage = await storeFileAndReturnNameBase64(
        req.body.marriageProofCoupleImage
      );
    }

    if (
      req.body.marriageProofParentAadharMomFrontSide &&
      req.body.marriageProofParentAadharMomFrontSide.includes("base64")
    ) {
      req.body.marriageProofParentAadharMomFrontSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharMomFrontSide
        );
    }

    if (
      req.body.marriageProofParentAadharMomBackSide &&
      req.body.marriageProofParentAadharMomBackSide.includes("base64")
    ) {
      req.body.marriageProofParentAadharMomBackSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharMomBackSide
        );
    }

    if (
      req.body.marriageProofParentAadharDadFrontSide &&
      req.body.marriageProofParentAadharDadFrontSide.includes("base64")
    ) {
      req.body.marriageProofParentAadharDadFrontSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharDadFrontSide
        );
    }

    if (
      req.body.marriageProofParentAadharDadBackSide &&
      req.body.marriageProofParentAadharDadBackSide.includes("base64")
    ) {
      req.body.marriageProofParentAadharDadBackSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharDadBackSide
        );
    }

    if (
      req.body.ParentAadharDadFrontSideBride &&
      req.body.ParentAadharDadFrontSideBride.includes("base64")
    ) {
      req.body.ParentAadharDadFrontSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharDadFrontSideBride
        );
    }

    if (
      req.body.ParentAadharDadBackSideBride &&
      req.body.ParentAadharDadBackSideBride.includes("base64")
    ) {
      req.body.ParentAadharDadBackSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharDadBackSideBride
        );
    }

    if (
      req.body.ParentAadharMomFrontSideBride &&
      req.body.ParentAadharMomFrontSideBride.includes("base64")
    ) {
      req.body.ParentAadharMomFrontSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharMomFrontSideBride
        );
    }

    if (
      req.body.ParentAadharMomBackSideBride &&
      req.body.ParentAadharMomBackSideBride.includes("base64")
    ) {
      req.body.ParentAadharMomBackSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharMomBackSideBride
        );
    }

    if (
      req.body.FamilyIdImageBride &&
      req.body.FamilyIdImageBride.includes("base64")
    ) {
      req.body.FamilyIdImageBride = await storeFileAndReturnNameBase64(
        req.body.FamilyIdImageBride
      );
    }

    if (
      req.body.brideOtherIdProofImage &&
      req.body.brideOtherIdProofImage.includes("base64")
    ) {
      req.body.brideOtherIdProofImage = await storeFileAndReturnNameBase64(
        req.body.brideOtherIdProofImage
      );
    }

    // check all document is uploaded first pending for now
    const UserExistEmailCheck = await User.findById(req.user?.userId)
      .lean()
      .exec();

    if (
      UserExistEmailCheck &&
      UserExistEmailCheck.name &&
      UserExistEmailCheck.email
    ) {
      const frontendUrl =
        `${process.env.FRONTEND_URL}/document` || "http://localhost:3000";
      const html = await documentSumittedSuccessfully(
        UserExistEmailCheck.name,
        UserExistEmailCheck.email,
        frontendUrl
      );

      await SendBrevoMail(
        "Document Sumitted Successfully",
        [
          {
            name: UserExistEmailCheck.name,
            email: UserExistEmailCheck.email,
          },
        ],
        html
      );
    }

    console.log("check 2 ", "for check Document");
    const document = await new Document({
      ...req.body,
      userId: req.user?.userId,
    }).save();
    res.status(201).json({ message: "Document Created" });
  } catch (error) {
    next(error);
  }
};

export const getAllDocument = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};

    // Stage 1: Lookup user details
    pipeline.push({
      $lookup: {
        from: "users", // Assuming your User collection is named 'users'
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });

    // Stage 2: Deconstruct the user array
    pipeline.push({
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true, // Keep documents even if no matching user is found
      },
    });

    if (req.query.query && req.query.query != "") {
      matchObj.$or = [
        { emailId: new RegExp(req.query.query, "i") },
        { mobileNumber: new RegExp(req.query.query, "i") },
        { "user.fullName": new RegExp(req.query.query, "i") }, // Search by user's full name
      ];
    }
    pipeline.push({ $match: matchObj });

    // Stage 3: Project to reshape the output and include userName
    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        emailId: 1,
        mobileNumber: 1,
        userName: { $ifNull: ["$user.name", "Unknown User"] },
        isDeleted: 1, // Changed from $user.fullName to $user.name
        // Include other fields from the Document model you need to return
        // Example: groomAadharFront: 1, brideAadharFront: 1, etc.
      },
    });

    let DocumentArr = await paginateAggregate(Document, pipeline, req.query);

    res.status(201).json({
      message: "found all Device",
      data: DocumentArr.data,
      total: DocumentArr.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user?.userId) {
      throw new Error("Unauthorized User");
    }
    console.log(req?.user?.userId, "||");
    let document = await Document.find({
      userId: req?.user?.userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log(document, "document");

    // if(document.length > 1) {
    //   throw new Error("Multiple Document does not exists");
    // }

    if (!document) {
      throw new Error("Document does not exists");
    }

    res.status(201).json({ message: "document Images found", data: document });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.params.id) {
      matchObj._id = new mongoose.Types.ObjectId(req.params.id);
    }
    pipeline.push({
      $match: matchObj,
    });
    let existsCheck = await Document.aggregate(pipeline);
    if (!existsCheck || existsCheck.length == 0) {
      throw new Error("Document does not exists");
    }
    existsCheck = existsCheck[0];
    res.status(201).json({
      message: "found specific Contact",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.params.userId) {
      console.log(matchObj.UserId, req.params.userId);
      matchObj.userId = new mongoose.Types.ObjectId(req.params.userId);
    }
    pipeline.push({
      $match: matchObj,
    });
    let existsCheck = await Document.aggregate(pipeline);
    if (!existsCheck || existsCheck.length == 0) {
      throw new Error("Document does not exists");
    }
    existsCheck = existsCheck[0];
    res.status(201).json({
      message: "found specific Contact",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Document.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Document does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }

    if (
      req?.body?.groomAadharFront &&
      req.body.groomAadharFront.includes("base64")
    ) {
      if (existsCheck?.groomAadharFront) {
        await deleteFile(existsCheck?.groomAadharFront);
      }
      req.body.groomAadharFront = await storeFileAndReturnNameBase64(
        req.body.groomAadharFront
      );
    }
    if (
      req?.body?.groomAadharBack &&
      req.body.groomAadharBack.includes("base64")
    ) {
      if (existsCheck?.groomAadharBack) {
        await deleteFile(existsCheck?.groomAadharBack);
      }
      req.body.groomAadharBack = await storeFileAndReturnNameBase64(
        req.body.groomAadharBack
      );
    }
    if (
      req?.body?.groomOtherProofImage &&
      req.body.groomOtherProofImage.includes("base64")
    ) {
      if (existsCheck?.groomOtherProofImage) {
        await deleteFile(existsCheck?.groomOtherProofImage);
      }
      req.body.groomOtherProofImage = await storeFileAndReturnNameBase64(
        req.body.groomOtherProofImage
      );
    }
    if (
      req?.body?.groomBirthProofImage &&
      req.body.groomBirthProofImage.includes("base64")
    ) {
      if (existsCheck?.groomBirthProofImage) {
        await deleteFile(existsCheck?.groomBirthProofImage);
      }
      req.body.groomBirthProofImage = await storeFileAndReturnNameBase64(
        req.body.groomBirthProofImage
      );
    }
    if (
      req?.body?.brideAadharFront &&
      req.body.brideAadharFront.includes("base64")
    ) {
      if (existsCheck?.brideAadharFront) {
        await deleteFile(existsCheck?.brideAadharFront);
      }
      req.body.brideAadharFront = await storeFileAndReturnNameBase64(
        req.body.brideAadharFront
      );
    }
    if (
      req?.body?.brideAadharBack &&
      req.body.brideAadharBack.includes("base64")
    ) {
      if (existsCheck?.brideAadharBack) {
        await deleteFile(existsCheck?.brideAadharBack);
      }
      req.body.brideAadharBack = await storeFileAndReturnNameBase64(
        req.body.brideAadharBack
      );
    }
    if (
      req?.body?.brideOtherProofImage &&
      req.body.brideOtherProofImage.includes("base64")
    ) {
      if (existsCheck?.brideOtherProofImage) {
        await deleteFile(existsCheck?.brideOtherProofImage);
      }
      req.body.brideOtherProofImage = await storeFileAndReturnNameBase64(
        req.body.brideOtherProofImage
      );
    }
    if (
      req?.body?.brideBirthProofImage &&
      req.body.brideBirthProofImage.includes("base64")
    ) {
      if (existsCheck?.brideBirthProofImage) {
        await deleteFile(existsCheck?.brideBirthProofImage);
      }
      req.body.brideBirthProofImage = await storeFileAndReturnNameBase64(
        req.body.brideBirthProofImage
      );
    }
    if (
      req?.body?.witness1AadharFront &&
      req.body.witness1AadharFront.includes("base64")
    ) {
      if (existsCheck?.witness1AadharFront) {
        await deleteFile(existsCheck?.witness1AadharFront);
      }
      req.body.witness1AadharFront = await storeFileAndReturnNameBase64(
        req.body.witness1AadharFront
      );
    }
    if (
      req?.body?.witness1AadharBack &&
      req.body.witness1AadharBack.includes("base64")
    ) {
      if (existsCheck?.witness1AadharBack) {
        await deleteFile(existsCheck?.witness1AadharBack);
      }
      req.body.witness1AadharBack = await storeFileAndReturnNameBase64(
        req.body.witness1AadharBack
      );
    }
    if (
      req?.body?.witness1OtherProofImage &&
      req.body.witness1OtherProofImage.includes("base64")
    ) {
      if (existsCheck?.witness1OtherProofImage) {
        await deleteFile(existsCheck?.witness1OtherProofImage);
      }
      req.body.witness1OtherProofImage = await storeFileAndReturnNameBase64(
        req.body.witness1OtherProofImage
      );
    }
    if (
      req?.body?.witness2AadharFront &&
      req.body.witness2AadharFront.includes("base64")
    ) {
      if (existsCheck?.witness2AadharFront) {
        await deleteFile(existsCheck?.witness2AadharFront);
      }
      req.body.witness2AadharFront = await storeFileAndReturnNameBase64(
        req.body.witness2AadharFront
      );
    }
    if (
      req?.body?.witness2AadharBack &&
      req.body.witness2AadharBack.includes("base64")
    ) {
      if (existsCheck?.witness2AadharBack) {
        await deleteFile(existsCheck?.witness2AadharBack);
      }

      req.body.witness2AadharBack = await storeFileAndReturnNameBase64(
        req.body.witness2AadharBack
      );
    }
    if (
      req?.body?.witness2OtherProofImage &&
      req.body.witness2OtherProofImage.includes("base64")
    ) {
      if (existsCheck?.witness2OtherProofImage) {
        await deleteFile(existsCheck?.witness2OtherProofImage);
      }
      req.body.witness2OtherProofImage = await storeFileAndReturnNameBase64(
        req.body.witness2OtherProofImage
      );
    }
    if (
      req?.body?.witness3AadharFront &&
      req.body.witness3AadharFront.includes("base64")
    ) {
      if (existsCheck?.witness3AadharFront) {
        await deleteFile(existsCheck?.witness3AadharFront);
      }

      req.body.witness3AadharFront = await storeFileAndReturnNameBase64(
        req.body.witness3AadharFront
      );
    }
    if (
      req?.body?.witness3AadharBack &&
      req.body.witness3AadharBack.includes("base64")
    ) {
      if (existsCheck?.witness3AadharBack) {
        await deleteFile(existsCheck?.witness3AadharBack);
      }
      req.body.witness3AadharBack = await storeFileAndReturnNameBase64(
        req.body.witness3AadharBack
      );
    }
    if (
      req?.body?.witness3OtherProofImage &&
      req.body.witness3OtherProofImage.includes("base64")
    ) {
      if (existsCheck?.witness3OtherProofImage) {
        await deleteFile(existsCheck?.witness3OtherProofImage);
      }
      req.body.witness3OtherProofImage = await storeFileAndReturnNameBase64(
        req.body.witness3OtherProofImage
      );
    }
    if (
      req?.body?.marriageProofVarmala &&
      req.body.marriageProofVarmala.includes("base64")
    ) {
      if (existsCheck?.marriageProofVarmala) {
        await deleteFile(existsCheck?.marriageProofVarmala);
      }
      req.body.marriageProofVarmala = await storeFileAndReturnNameBase64(
        req.body.marriageProofVarmala
      );
    }
    if (
      req?.body?.marriageProofPhera &&
      req.body.marriageProofPhera.includes("base64")
    ) {
      if (existsCheck?.marriageProofPhera) {
        await deleteFile(existsCheck?.marriageProofPhera);
      }
      req.body.marriageProofPhera = await storeFileAndReturnNameBase64(
        req.body.marriageProofPhera
      );
    }
    if (
      req?.body?.marriageProofInvitation &&
      req.body.marriageProofInvitation.includes("base64")
    ) {
      if (existsCheck?.marriageProofInvitation) {
        await deleteFile(existsCheck?.marriageProofInvitation);
      }
      req.body.marriageProofInvitation = await storeFileAndReturnNameBase64(
        req.body.marriageProofInvitation
      );
    }
    if (
      req?.body?.marriageProofPhoto &&
      req.body.marriageProofPhoto.includes("base64")
    ) {
      if (existsCheck?.marriageProofPhoto) {
        await deleteFile(existsCheck?.marriageProofPhoto);
      }
      req.body.marriageProofPhoto = await storeFileAndReturnNameBase64(
        req.body.marriageProofPhoto
      );
    }
    if (
      req?.body?.bridePassportPhoto &&
      req?.body?.bridePassportPhoto.includes("base64")
    ) {
      if (existsCheck?.bridePassportPhoto) {
        await deleteFile(existsCheck?.bridePassportPhoto);
      }
      req.body.bridePassportPhoto = await storeFileAndReturnNameBase64(
        req.body.bridePassportPhoto
      );
    }

    if (
      req?.body?.witness1PassportPhoto &&
      req.body.witness1PassportPhoto.includes("base64")
    ) {
      if (existsCheck?.witness1PassportPhoto) {
        await deleteFile(existsCheck?.witness1PassportPhoto);
      }
      req.body.witness1PassportPhoto = await storeFileAndReturnNameBase64(
        req.body.witness1PassportPhoto
      );
    }
    if (
      req?.body?.witness1PanCardPhoto &&
      req.body.witness1PanCardPhoto.includes("base64")
    ) {
      if (existsCheck?.witness1PanCardPhoto) {
        await deleteFile(existsCheck?.witness1PanCardPhoto);
      }
      req.body.witness1PanCardPhoto = await storeFileAndReturnNameBase64(
        req.body.witness1PanCardPhoto
      );
    }

    if (
      req?.body?.witness2PassportPhoto &&
      req.body.witness2PassportPhoto.includes("base64")
    ) {
      if (existsCheck?.witness2PassportPhoto) {
        await deleteFile(existsCheck?.witness2PassportPhoto);
      }
      req.body.witness2PassportPhoto = await storeFileAndReturnNameBase64(
        req.body.witness2PassportPhoto
      );
    }
    if (
      req?.body?.witness2PanCardPhoto &&
      req.body.witness2PanCardPhoto.includes("base64")
    ) {
      if (existsCheck?.witness2PanCardPhoto) {
        await deleteFile(existsCheck?.witness2PanCardPhoto);
      }

      req.body.witness2PanCardPhoto = await storeFileAndReturnNameBase64(
        req.body.witness2PanCardPhoto
      );
    }
    if (
      req?.body?.witness3PassportPhoto &&
      req.body.witness3PassportPhoto.includes("base64")
    ) {
      if (existsCheck?.witness3PassportPhoto) {
        await deleteFile(existsCheck?.witness3PassportPhoto);
      }
      req.body.witness3PassportPhoto = await storeFileAndReturnNameBase64(
        req.body.witness3PassportPhoto
      );
    }
    if (
      req?.body?.witness3PanCardPhoto &&
      req.body.witness3PanCardPhoto.includes("base64")
    ) {
      if (existsCheck?.witness3PanCardPhoto) {
        await deleteFile(existsCheck?.witness3PanCardPhoto);
      }
      req.body.witness3PanCardPhoto = await storeFileAndReturnNameBase64(
        req.body.witness3PanCardPhoto
      );
    }

    if (
      req?.body?.signatureImageBride &&
      req.body.signatureImageBride.includes("base64")
    ) {
      if (existsCheck?.signatureImageBride) {
        await deleteFile(existsCheck?.signatureImageBride);
      }
      req.body.signatureImageBride = await storeFileAndReturnNameBase64(
        req.body.signatureImageBride
      );
    }

    if (
      req?.body?.signatureImageGroom &&
      req.body.signatureImageGroom.includes("base64")
    ) {
      if (existsCheck?.signatureImageGroom) {
        await deleteFile(existsCheck?.signatureImageGroom);
      }
      req.body.signatureImageGroom = await storeFileAndReturnNameBase64(
        req.body.signatureImageGroom
      );
    }

    if (
      req?.body?.signatureImageWitness1 &&
      req.body.signatureImageWitness1.includes("base64")
    ) {
      if (existsCheck?.signatureImageWitness1) {
        await deleteFile(existsCheck?.signatureImageWitness1);
      }
      req.body.signatureImageWitness1 = await storeFileAndReturnNameBase64(
        req.body.signatureImageWitness1
      );
    }

    if (
      req?.body?.signatureImageWitness2 &&
      req.body.signatureImageWitness2.includes("base64")
    ) {
      if (existsCheck?.signatureImageWitness2) {
        await deleteFile(existsCheck?.signatureImageWitness2);
      }
      req.body.signatureImageWitness2 = await storeFileAndReturnNameBase64(
        req.body.signatureImageWitness2
      );
    }

    if (
      req?.body?.signatureImageWitness3 &&
      req.body.signatureImageWitness3.includes("base64")
    ) {
      if (existsCheck?.signatureImageWitness3) {
        await deleteFile(existsCheck?.signatureImageWitness3);
      }
      req.body.signatureImageWitness3 = await storeFileAndReturnNameBase64(
        req.body.signatureImageWitness3
      );
    }

    if (
      req?.body?.groomFamilyIdImage &&
      req.body.groomFamilyIdImage.includes("base64")
    ) {
      if (existsCheck?.groomFamilyIdImage) {
        await deleteFile(existsCheck?.groomFamilyIdImage);
      }
      req.body.groomFamilyIdImage = await storeFileAndReturnNameBase64(
        req.body.groomFamilyIdImage
      );
    }

    if (
      req?.body?.brideFamilyIdImage &&
      req.body.brideFamilyIdImage.includes("base64")
    ) {
      if (existsCheck?.brideFamilyIdImage) {
        await deleteFile(existsCheck?.brideFamilyIdImage);
      }
      req.body.brideFamilyIdImage = await storeFileAndReturnNameBase64(
        req.body.brideFamilyIdImage
      );
    }

    if (
      req?.body?.additionalDocumentProofImage &&
      req.body.additionalDocumentProofImage.includes("base64")
    ) {
      if (existsCheck?.additionalDocumentProofImage) {
        await deleteFile(existsCheck?.additionalDocumentProofImage);
      }
      req.body.additionalDocumentProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentProofImage
        );
    }

    if (
      req?.body?.additionalDocumentBrideProofImage &&
      req.body.additionalDocumentBrideProofImage.includes("base64")
    ) {
      if (existsCheck?.additionalDocumentBrideProofImage) {
        await deleteFile(existsCheck?.additionalDocumentBrideProofImage);
      }

      req.body.additionalDocumentBrideProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentBrideProofImage
        );
    }

    if (
      req?.body?.coupleImageWhiteBackground &&
      req.body.coupleImageWhiteBackground.includes("base64")
    ) {
      if (existsCheck?.coupleImageWhiteBackground) {
        await deleteFile(existsCheck?.coupleImageWhiteBackground);
      }
      req.body.coupleImageWhiteBackground = await storeFileAndReturnNameBase64(
        req.body.coupleImageWhiteBackground
      );
    }

    if (
      req?.body?.parentAadharMomFrontSide &&
      req.body.parentAadharMomFrontSide.includes("base64")
    ) {
      if (existsCheck?.parentAadharMomFrontSide) {
        await deleteFile(existsCheck?.parentAadharMomFrontSide);
      }
      req.body.parentAadharMomFrontSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharMomFrontSide
      );
    }

    if (
      req?.body?.parentAadharMomBackSide &&
      req.body.parentAadharMomBackSide.includes("base64")
    ) {
      if (existsCheck?.parentAadharMomBackSide) {
        await deleteFile(existsCheck?.parentAadharMomBackSide);
      }
      req.body.parentAadharMomBackSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharMomBackSide
      );
    }

    if (
      req?.body?.parentAadharDadFrontSide &&
      req.body.parentAadharDadFrontSide.includes("base64")
    ) {
      if (existsCheck?.parentAadharDadFrontSide) {
        await deleteFile(existsCheck?.parentAadharDadFrontSide);
      }
      req.body.parentAadharDadFrontSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharDadFrontSide
      );
    }

    if (
      req?.body?.parentAadharDadBackSide &&
      req.body.parentAadharDadBackSide.includes("base64")
    ) {
      if (existsCheck?.parentAadharDadBackSide) {
        await deleteFile(existsCheck?.parentAadharDadBackSide);
      }
      req.body.parentAadharDadBackSide = await storeFileAndReturnNameBase64(
        req.body.parentAadharDadBackSide
      );
    }

    if (
      req?.body?.bridePassportFrontImage &&
      req.body.bridePassportFrontImage.includes("base64")
    ) {
      if (existsCheck?.bridePassportFrontImage) {
        await deleteFile(existsCheck?.bridePassportFrontImage);
      }
      req.body.bridePassportFrontImage = await storeFileAndReturnNameBase64(
        req.body.bridePassportFrontImage
      );
    }

    if (
      req?.body?.bridePassportBackImage &&
      req.body.bridePassportBackImage.includes("base64")
    ) {
      if (existsCheck?.bridePassportBackImage) {
        await deleteFile(existsCheck?.bridePassportBackImage);
      }
      req.body.bridePassportBackImage = await storeFileAndReturnNameBase64(
        req.body.bridePassportBackImage
      );
    }

    if (
      req?.body?.brideDrivingLicenseFrontImage &&
      req.body.brideDrivingLicenseFrontImage.includes("base64")
    ) {
      if (existsCheck?.brideDrivingLicenseFrontImage) {
        await deleteFile(existsCheck?.brideDrivingLicenseFrontImage);
      }
      req.body.brideDrivingLicenseFrontImage =
        await storeFileAndReturnNameBase64(
          req.body.brideDrivingLicenseFrontImage
        );
    }

    if (
      req?.body?.brideDrivingLicenseBackImage &&
      req.body.brideDrivingLicenseBackImage.includes("base64")
    ) {
      if (existsCheck?.brideDrivingLicenseBackImage) {
        await deleteFile(existsCheck?.brideDrivingLicenseBackImage);
      }
      req.body.brideDrivingLicenseBackImage =
        await storeFileAndReturnNameBase64(
          req.body.brideDrivingLicenseBackImage
        );
    }

    if (
      req?.body?.brideVoterIdFrontImage &&
      req.body.brideVoterIdFrontImage.includes("base64")
    ) {
      if (existsCheck?.brideVoterIdFrontImage) {
        await deleteFile(existsCheck?.brideVoterIdFrontImage);
      }
      req.body.brideVoterIdFrontImage = await storeFileAndReturnNameBase64(
        req.body.brideVoterIdFrontImage
      );
    }

    if (
      req?.body?.brideVoterIdBackImage &&
      req.body.brideVoterIdBackImage.includes("base64")
    ) {
      if (existsCheck?.brideVoterIdBackImage) {
        await deleteFile(existsCheck?.brideVoterIdBackImage);
      }
      req.body.brideVoterIdBackImage = await storeFileAndReturnNameBase64(
        req.body.brideVoterIdBackImage
      );
    }

    if (
      req?.body?.brideInvitationCardImage &&
      req.body.brideInvitationCardImage.includes("base64")
    ) {
      if (existsCheck?.brideInvitationCardImage) {
        await deleteFile(existsCheck?.brideInvitationCardImage);
      }
      req.body.brideInvitationCardImage = await storeFileAndReturnNameBase64(
        req.body.brideInvitationCardImage
      );
    }

    if (
      req?.body?.bridePPSizePhoto &&
      req.body.bridePPSizePhoto.includes("base64")
    ) {
      if (existsCheck?.bridePPSizePhoto) {
        await deleteFile(existsCheck?.bridePPSizePhoto);
      }
      req.body.bridePPSizePhoto = await storeFileAndReturnNameBase64(
        req.body.bridePPSizePhoto
      );
    }

    if (
      req?.body?.brideParentsAadhar &&
      req.body.brideParentsAadhar.includes("base64")
    ) {
      if (existsCheck?.brideParentsAadhar) {
        await deleteFile(existsCheck?.brideParentsAadhar);
      }
      req.body.brideParentsAadhar = await storeFileAndReturnNameBase64(
        req.body.brideParentsAadhar
      );
    }

    if (
      req?.body?.brideParentsAadharBack &&
      req.body.brideParentsAadharBack.includes("base64")
    ) {
      if (existsCheck?.brideParentsAadharBack) {
        await deleteFile(existsCheck?.brideParentsAadharBack);
      }
      req.body.brideParentsAadharBack = await storeFileAndReturnNameBase64(
        req.body.brideParentsAadharBack
      );
    }

    if (
      req?.body?.additionalDocumentWitness1ProofImage &&
      req.body.additionalDocumentWitness1ProofImage.includes("base64")
    ) {
      if (existsCheck?.additionalDocumentWitness1ProofImage) {
        await deleteFile(existsCheck?.additionalDocumentWitness1ProofImage);
      }
      req.body.additionalDocumentWitness1ProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentWitness1ProofImage
        );
    }

    if (
      req?.body?.additionalDocumentWitness2ProofImage &&
      req.body.additionalDocumentWitness2ProofImage.includes("base64")
    ) {
      if (existsCheck?.additionalDocumentWitness2ProofImage) {
        await deleteFile(existsCheck?.additionalDocumentWitness2ProofImage);
      }
      req.body.additionalDocumentWitness2ProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentWitness2ProofImage
        );
    }

    if (
      req?.body?.additionalDocumentWitness3ProofImage &&
      req.body.additionalDocumentWitness3ProofImage.includes("base64")
    ) {
      if (existsCheck?.additionalDocumentWitness3ProofImage) {
        await deleteFile(existsCheck?.additionalDocumentWitness3ProofImage);
      }
      req.body.additionalDocumentWitness3ProofImage =
        await storeFileAndReturnNameBase64(
          req.body.additionalDocumentWitness3ProofImage
        );
    }

    if (
      req?.body?.marriageProofCoupleImage &&
      req.body.marriageProofCoupleImage.includes("base64")
    ) {
      if (existsCheck?.marriageProofCoupleImage) {
        await deleteFile(existsCheck?.marriageProofCoupleImage);
      }
      req.body.marriageProofCoupleImage = await storeFileAndReturnNameBase64(
        req.body.marriageProofCoupleImage
      );
    }

    if (
      req?.body?.marriageProofParentAadharMomFrontSide &&
      req.body.marriageProofParentAadharMomFrontSide.includes("base64")
    ) {
      if (existsCheck?.marriageProofParentAadharMomFrontSide) {
        await deleteFile(existsCheck?.marriageProofParentAadharMomFrontSide);
      }
      req.body.marriageProofParentAadharMomFrontSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharMomFrontSide
        );
    }

    if (
      req?.body?.marriageProofParentAadharMomBackSide &&
      req.body.marriageProofParentAadharMomBackSide.includes("base64")
    ) {
      if (existsCheck?.marriageProofParentAadharMomBackSide) {
        await deleteFile(existsCheck?.marriageProofParentAadharMomBackSide);
      }
      req.body.marriageProofParentAadharMomBackSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharMomBackSide
        );
    }

    if (
      req?.body?.marriageProofParentAadharDadFrontSide &&
      req.body.marriageProofParentAadharDadFrontSide.includes("base64")
    ) {
      if (existsCheck?.marriageProofParentAadharDadFrontSide) {
        await deleteFile(existsCheck?.marriageProofParentAadharDadFrontSide);
      }
      req.body.marriageProofParentAadharDadFrontSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharDadFrontSide
        );
    }

    if (
      req?.body?.marriageProofParentAadharDadBackSide &&
      req.body.marriageProofParentAadharDadBackSide.includes("base64")
    ) {
      if (existsCheck?.marriageProofParentAadharDadBackSide) {
        await deleteFile(existsCheck?.marriageProofParentAadharDadBackSide);
      }
      req.body.marriageProofParentAadharDadBackSide =
        await storeFileAndReturnNameBase64(
          req.body.marriageProofParentAadharDadBackSide
        );
    }

    if (
      req.body.ParentAadharDadFrontSideBride &&
      req.body.ParentAadharDadFrontSideBride.includes("base64")
    ) {
      if (existsCheck?.ParentAadharDadFrontSideBride) {
        await deleteFile(existsCheck?.ParentAadharDadFrontSideBride);
      }
      req.body.ParentAadharDadFrontSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharDadFrontSideBride
        );
    }

    if (
      req.body.ParentAadharDadBackSideBride &&
      req.body.ParentAadharDadBackSideBride.includes("base64")
    ) {
      if (existsCheck?.ParentAadharDadBackSideBride) {
        await deleteFile(existsCheck?.ParentAadharDadBackSideBride);
      }
      req.body.ParentAadharDadBackSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharDadBackSideBride
        );
    }

    if (
      req.body.ParentAadharMomFrontSideBride &&
      req.body.ParentAadharMomFrontSideBride.includes("base64")
    ) {
      if (existsCheck?.ParentAadharMomFrontSideBride) {
        await deleteFile(existsCheck?.ParentAadharMomFrontSideBride);
      }
      req.body.ParentAadharMomFrontSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharMomFrontSideBride
        );
    }

    if (
      req.body.ParentAadharMomBackSideBride &&
      req.body.ParentAadharMomBackSideBride.includes("base64")
    ) {
      if (existsCheck?.ParentAadharMomBackSideBride) {
        await deleteFile(existsCheck?.ParentAadharMomBackSideBride);
      }
      req.body.ParentAadharMomBackSideBride =
        await storeFileAndReturnNameBase64(
          req.body.ParentAadharMomBackSideBride
        );
    }

    if (
      req.body.FamilyIdImageBride &&
      req.body.FamilyIdImageBride.includes("base64")
    ) {
      if (existsCheck?.FamilyIdImageBride) {
        await deleteFile(existsCheck?.FamilyIdImageBride);
      }
      req.body.FamilyIdImageBride = await storeFileAndReturnNameBase64(
        req.body.FamilyIdImageBride
      );
    }

    if (
      req.body.brideOtherIdProofImage &&
      req.body.brideOtherIdProofImage.includes("base64")
    ) {
      if (existsCheck?.brideOtherIdProofImage) {
        await deleteFile(existsCheck?.brideOtherIdProofImage);
      }
      req.body.brideOtherIdProofImage = await storeFileAndReturnNameBase64(
        req.body.brideOtherIdProofImage
      );
    }

    const UserExistEmailCheck = await User.findById(req.body?.userId)
      .lean()
      .exec();

    console.log(UserExistEmailCheck, "UserExistEmailCheck");

    if (
      UserExistEmailCheck &&
      UserExistEmailCheck.name &&
      UserExistEmailCheck.email
    ) {
      if (req?.body?.isDocumentVerified) {
        const html = await successfullDocumentVerification(
          UserExistEmailCheck.name
        );

        await SendBrevoMail(
          "Document Verified Successfully",
          [
            {
              name: UserExistEmailCheck.name,
              email: UserExistEmailCheck.email,
            },
          ],
          html
        );
      } else if (!req.body?.isDocumentVerified && req.body.remark) {
        const frontendUrl =
          `${process.env.FRONTEND_URL}/document` || "http://localhost:3000";
        const html = await documentRejectionAndReUpload(
          req.body.remark,
          UserExistEmailCheck.name,
          frontendUrl
        );

        await SendBrevoMail(
          "Document Rejected",
          [
            {
              name: UserExistEmailCheck.name,
              email: UserExistEmailCheck.email,
            },
          ],
          html
        );
      }
    }

    let Obj = await Document.findByIdAndUpdate(req.params.id, req.body).exec();
    res.status(201).json({ message: "Document Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Document.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Document does not exists or already deleted");
    }
    await Document.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    }).exec();
    res.status(201).json({ message: "Document Deleted" });
  } catch (error) {
    next(error);
  }
};
