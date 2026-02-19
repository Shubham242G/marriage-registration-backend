import { model, Model, Schema, Types } from "mongoose";

interface IDocument {
  userId: Schema.Types.ObjectId;
  groomAadharFront: string;

  groomAadharBack: string;
  groomOtherProofImage: string;
  groomBirthProofImage: string;
  brideAadharFront: string;
  brideAadharBack: string;
  brideOtherProofImage: string;
  brideBirthProofImage: string;
  witness1AadharFront: string;
  witness1AadharBack: string;
  witness1OtherProofImage: string;
  witness2AadharFront: string;
  witness2AadharBack: string;
  witness2OtherProofImage: string;
  witness3AadharFront: string;
  witness3AadharBack: string;
  witness3OtherProofImage: string;
  marriageProofVarmala: string;
  marriageProofPhera: string;
  marriageProofInvitation: string;
  marriageProofPhoto: string;
  marriageProofCoupleImage: string;
  marriageProofParentAadharMomFrontSide: string;
  marriageProofParentAadharMomBackSide: string;
  marriageProofParentAadharDadFrontSide: string;
  marriageProofParentAadharDadBackSide: string;
  mobileNumber: string;
  emailId: string;
  bridePassportPhoto: string;
  witness1PassportPhoto: string;
  witness1PanCardPhoto: string;
  witness2PassportPhoto: string;
  witness2PanCardPhoto: string;
  witness3PassportPhoto: string;
  witness3PanCardPhoto: string;
  groomOtherProofName: string;
  groomBirthProofName: string;
  brideOtherProofName: string;
  brideBirthProofName: string;
  isDocumentVerified: boolean;
  remark: string;
  signatureImageGroom: string;
  signatureImageBride: string;
  signatureImageWitness1: string;
  signatureImageWitness2: string;
  signatureImageWitness3: string;
  // new fields
  selectedState: string;
  dateOfMarriage: Date;
  venueOfMarriage: string;
  groomMobile: string;
  groomEmail: string;
  groomFamilyIdImage: string;
  brideFamilyIdImage: string;
  additionalDocumentName: string;
  additionalDocumentProofImage: string;
  additionalDocumentBrideProofImage: string;
  additionalDocumentBrideProofName: string;

  // new fields for 2nd marriage
  coupleImageWhiteBackground: string;
  parentAadharMomFrontSide: string;
  parentAadharMomBackSide: string;
  parentAadharDadFrontSide: string;
  parentAadharDadBackSide: string;
  brideAddressProofName: string;
  bridePassportFrontImage: string;
  bridePassportBackImage: string;
  brideDrivingLicenseFrontImage: string;
  brideDrivingLicenseBackImage: string;
  brideVoterIdFrontImage: string;
  brideVoterIdBackImage: string;
  brideInvitationCardImage: string;
  bridePPSizePhoto: string;
  brideParentsAadhar: string;
  brideParentsAadharBack: string;
  brideOtherInfoOccupation: string;
  brideOtherInfoMaritalStatus: string;
  brideOtherInfoResidingSinceYear: string;

  // new fields for 3rd marriage
  additionalDocumentWitness1Name: string;

  additionalDocumentWitness1ProofImage: string;
  additionalDocumentWitness2Name: string;
  additionalDocumentWitness2ProofImage: string;
  additionalDocumentWitness3Name: string;
  additionalDocumentWitness3ProofImage: string;
  witness1PhoneNumber: string;
  witness2PhoneNumber: string;
  witness3PhoneNumber: string;

  groomOtherInfoOccupation: String;
  groomOtherInfoReligion: String;
  groomOtherInfoMaritalStatus: String;
  groomOtherInfoResidingSinceYear: String;
  brideOtherInfoReligion: String;

  ParentAadharDadFrontSideBride: string;
  ParentAadharDadBackSideBride: string;
  ParentAadharMomFrontSideBride: string;
  ParentAadharMomBackSideBride: string;
  FamilyIdImageBride: string;
  brideOtherIdProofImage: string;
  brideOtherIdProofName: string;
  isDeleted: boolean;
}

const DocumentSchema = new Schema(
  {
    userId: Types.ObjectId,
    groomAadharFront: String,

    groomAadharBack: String,
    groomOtherProofImage: String,
    groomBirthProofImage: String,
    brideAadharFront: String,
    brideAadharBack: String,
    brideOtherProofImage: String,
    brideBirthProofImage: String,
    witness1AadharFront: String,
    witness1AadharBack: String,
    witness1OtherProofImage: String,
    witness2AadharFront: String,
    witness2AadharBack: String,
    witness2OtherProofImage: String,
    witness3AadharFront: String,
    witness3AadharBack: String,
    witness3OtherProofImage: String,
    marriageProofVarmala: String,
    marriageProofPhera: String,
    marriageProofInvitation: String,
    marriageProofPhoto: String,
    marriageProofCoupleImage: String,
    marriageProofParentAadharMomFrontSide: String,
    marriageProofParentAadharMomBackSide: String,
    marriageProofParentAadharDadFrontSide: String,
    marriageProofParentAadharDadBackSide: String,
    mobileNumber: String,
    emailId: String,
    bridePassportPhoto: String,
    witness1PassportPhoto: String,
    witness1PanCardPhoto: String,
    witness2PassportPhoto: String,
    witness2PanCardPhoto: String,
    witness3PassportPhoto: String,
    witness3PanCardPhoto: String,
    groomOtherProofName: String,
    groomBirthProofName: String,
    brideOtherProofName: String,
    brideBirthProofName: String,
    dateOfMarriage: String,
    venueOfMarriage: String,
    groomMobile: String,
    groomEmail: String,
    groomFamilyIdImage: String,
    brideFamilyIdImage: String,

    additionalDocumentName: String,
    additionalDocumentProofImage: String,
    additionalDocumentBrideProofImage: String,
    additionalDocumentBrideProofName: String,
    selectedState: String,

    coupleImageWhiteBackground: String,
    parentAadharMomFrontSide: String,
    parentAadharMomBackSide: String,
    parentAadharDadFrontSide: String,
    parentAadharDadBackSide: String,
    brideAddressProofName: String,
    bridePassportFrontImage: String,
    bridePassportBackImage: String,
    brideDrivingLicenseFrontImage: String,
    brideDrivingLicenseBackImage: String,
    brideVoterIdFrontImage: String,
    brideVoterIdBackImage: String,
    brideInvitationCardImage: String,
    bridePPSizePhoto: String,
    brideParentsAadhar: String,
    brideParentsAadharBack: String,
    brideOtherInfoOccupation: String,
    brideOtherInfoMaritalStatus: String,
    ParentAadharDadFrontSideBride: String,
    ParentAadharDadBackSideBride: String,
    ParentAadharMomFrontSideBride: String,
    ParentAadharMomBackSideBride: String,
    brideOtherInfoResidingSinceYear: String,
    additionalDocumentWitness1Name: String,

    additionalDocumentWitness1ProofImage: String,
    additionalDocumentWitness2Name: String,
    additionalDocumentWitness2ProofImage: String,
    additionalDocumentWitness3Name: String,
    additionalDocumentWitness3ProofImage: String,
    witness1PhoneNumber: String,
    witness2PhoneNumber: String,
    witness3PhoneNumber: String,

    //new
    groomOtherInfoOccupation: String,
    groomOtherInfoReligion: String,
    groomOtherInfoMaritalStatus: String,
    groomOtherInfoResidingSinceYear: String,
    brideOtherInfoReligion: String,
    remark: String,
    isDocumentVerified: Boolean,
    FamilyIdImageBride: String,
    brideOtherIdProofImage: String,
    brideOtherIdProofName: String,
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
