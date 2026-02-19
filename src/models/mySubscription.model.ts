import mongoose, { model, Schema, Types } from "mongoose";

export interface IMySubscription {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  startdate: Date;
  endDate: Date;
  isActive: boolean;
  isDeleted?: boolean;
}

const mySubscriptionSchema = new Schema<IMySubscription>(
  {
    userId: Types.ObjectId,
    subscriptionId: Types.ObjectId,
    startdate: Date,
    endDate: Date,
    isActive: Boolean,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MySubscription = model<IMySubscription>(
  "MySubscription",
  mySubscriptionSchema
);
