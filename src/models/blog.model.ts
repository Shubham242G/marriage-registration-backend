
import { model, Model, Schema, Types } from "mongoose";






export interface IBlog {

    bannerImage: string;
    Date: string;
    categoryId: string;
    createdBy: string;
    bannerTitle: string;
    slug: string;
    description: string;



}




const BlogSchema = new Schema({

    bannerImage: String,
    Date: String,
    categoryId: Types.ObjectId,
    createdBy: String,
    bannerTitle: String,
    slug: String,
    description: String
},
    {
        timestamps: true
    }

);

export const Blog = model<IBlog>("Blog", BlogSchema);
