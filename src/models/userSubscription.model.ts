import mongoose, { model, Schema, Types } from "mongoose";

export interface ISubscription {
  _id: Types.ObjectId;
  name: string;
  description: string;
  subscriptionType: string;
  numberOfMonths: number;
  actualPrice: number;
  discountedPrice: number;
  featureArray: string[];
  isDeleted?: boolean;
}

const userSubscription = new Schema<ISubscription>(
  {
    name: String,
    description: String,
    subscriptionType: String,
    numberOfMonths: Number,
    actualPrice: Number,
    discountedPrice: Number,
    featureArray: [] as string[],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserSubscription = model<ISubscription>(
  "UserSubscription",
  userSubscription
);
