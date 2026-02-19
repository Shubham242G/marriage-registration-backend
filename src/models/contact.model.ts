
import { model, Model, Schema, Types } from "mongoose";




interface IContact {

    fullName: string,
    companyName: string,
    email: string,
    phoneNumber: string,
    message: string,
    state: {
        label: string,
        value: string
    },
    city: string



}




const ContactSchema = new Schema({

    fullName: String,
    companyName: String,
    email: String,
    phoneNumber: String,
 
    city: String,
    message: String,
    state: {
        label: String,
        value: String
    },
},
    {
        timestamps: true
    }

);

export const Contact = model<IContact>("Contact", ContactSchema);
