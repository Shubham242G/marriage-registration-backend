
import { model, Model, Schema, Types } from "mongoose";






export interface ICategory {

    name: string,



}




const CategorySchema = new Schema({

    name: String,
},
    {
        timestamps: true
    }

);

export const Category = model<ICategory>("Category", CategorySchema);
