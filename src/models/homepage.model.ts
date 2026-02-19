import { model, Model, Schema, Types } from "mongoose";

interface IHomepage {
  bannerImage: string;
  bannerTitle: string;
  isActive?: boolean;
}

const HomepageSchema = new Schema(
  {
    bannerImage: String,
    bannerTitle: String,
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Homepage = model<IHomepage>("Homepage", HomepageSchema);
