import mongoose, { model, Schema, Types } from "mongoose";

export interface IGateWayPaymentObj {
  key?: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl?: string;
  furl?: string;
  hash?: string;
  service_provider: string;
  status?: string;
  payuMoneyId?: string;
  mode?: string;
  bankcode?: string;
}
export interface IPayment {
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  subscriptionName: string;
  amount: number;
  paymentcheck: boolean;
  status?: string;
  gatwayPaymentObj: IGateWayPaymentObj;
  message: string;
  isDeleted?: boolean;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: Schema.Types.ObjectId,
    subscriptionId: Schema.Types.ObjectId,
    subscriptionName: String,
    amount: Number,
    paymentcheck: Boolean,
    status: String,
    gatwayPaymentObj: {},
    message: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
