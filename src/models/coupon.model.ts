import { model, Schema, Document } from "mongoose";

interface ICoupon {
  code: string;
  discountType: string;
  discountValue: number;
  discountPercentage: number;
  minOrderValue: number;
  maxUsageCount: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true },
    discountType: { type: String, required: true },
    discountValue: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    minOrderValue: { type: Number, required: true },
    maxUsageCount: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Coupon = model<ICoupon>("Coupon", CouponSchema);
