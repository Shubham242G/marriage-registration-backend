import { model, Model, Schema, Types } from "mongoose";




interface IOTP {

    phone: string,
    otp: string,
    createdAt: string

}



const OTPSchema = new Schema({
    phone: {
        type: String,
        required: true,
        // unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires after 5 minutes (300 seconds)
    },
});

export const OTP = model<IOTP>('OTP', OTPSchema);