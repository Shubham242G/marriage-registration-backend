import { model, Model, Schema, Types } from "mongoose";

interface ISubscriber {
  email: string;
  isDeleted?: boolean;
}

const SubscriberSchema = new Schema(
  {
    email: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscriber = model<ISubscriber>("Subscriber", SubscriberSchema);
