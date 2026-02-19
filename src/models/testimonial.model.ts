
import { model, Model, Schema, Types } from "mongoose";




interface ITestimonial {

    userImage: string;
    name: string;
    designation: string;
    message: string;



}




const TestimonialSchema = new Schema({
    userImage: String,
    name: String,
    designation: String,
    message: String,
},
    {
        timestamps: true
    }

);

export const Testimonial = model<ITestimonial>("Testimonial", TestimonialSchema);
