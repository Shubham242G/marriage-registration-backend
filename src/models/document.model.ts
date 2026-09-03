import { model, Schema, Types } from "mongoose";

interface IDocument {
  userId: Schema.Types.ObjectId;
  
  // Groom Documents
  groomAadharFront: string;
  groomAadharBack: string;
  groomVoterIdFront: string;
  groomVoterIdBack: string;
  groomPassportFront: string;
  groomPassportBack: string;
  groomBirthCertificateImage: string;

  // Bride Documents
  brideAadharFront: string;
  brideAadharBack: string;
  brideOtherProofImage: string;
  brideBirthProofImage: string;

  // Marriage Proof
  marriageProofPhoto: string;
  marriageProofCoupleImage: string;
  marriageProofInvitation: string;

  // Religious Certificate
  religiousCertificateImage: string;

  // Witness 1
  witness1AadharFront: string;
  witness1AadharBack: string;
  witness1PanCardPhoto: string;

  // Witness 2
  witness2AadharFront: string;
  witness2AadharBack: string;
  witness2PanCardPhoto: string;

  // Signatures
  signatureImageGroom: string;
  signatureImageBride: string;
  signatureImageWitness1: string;
  signatureImageWitness2: string;

  isDocumentVerified: boolean;
  remark: string;
  isDeleted: boolean;
}

const DocumentSchema = new Schema(
  {
    userId: Types.ObjectId,

    // Groom Documents
    groomAadharFront: String,
    groomAadharBack: String,
    groomVoterIdFront: String,
    groomVoterIdBack: String,
    groomPassportFront: String,
    groomPassportBack: String,
    groomBirthCertificateImage: String,

    // Bride Documents
    brideAadharFront: String,
    brideAadharBack: String,
    brideOtherProofImage: String,
    brideBirthProofImage: String,

    // Marriage Proof
    marriageProofPhoto: String,
    marriageProofCoupleImage: String,
    marriageProofInvitation: String,

    // Religious Certificate
    religiousCertificateImage: String,

    // Witness 1
    witness1AadharFront: String,
    witness1AadharBack: String,
    witness1PanCardPhoto: String,

    // Witness 2
    witness2AadharFront: String,
    witness2AadharBack: String,
    witness2PanCardPhoto: String,

    // Signatures
    signatureImageGroom: String,
    signatureImageBride: String,
    signatureImageWitness1: String,
    signatureImageWitness2: String,

    isDocumentVerified: {
      type: Boolean,
      default: false,
    },
    remark: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = model<IDocument>("Document", DocumentSchema);