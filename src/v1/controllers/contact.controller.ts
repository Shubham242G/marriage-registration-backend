import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Contact } from "@models/contact.model";

export const addContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    
    console.log( req.body.phoneNumber , req.body.email, "check phone number and email ")
    let existsCheck = await Contact.findOne({
 phoneNumber: req?.body?.phoneNumber 
    }).exec();

    let existsCheck2 = await Contact.findOne({
      email: req?.body?.email
    }).exec();

    existsCheck = existsCheck || existsCheck2


    console.log(existsCheck, "existsCheck");
     
    if (existsCheck) {
        throw new Error("Contact with same email or phone already exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }

    console.log("check 2 ", "for check Contact");
    const contact = await new Contact(req.body).save();
    res
      .status(201)
      .json({
        message:
          "Thanks for reaching out to us! Our team will contact you shortly.",
      });
  } catch (error) {
    next(error);
  }
};

export const getAllContact = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.query.query && req.query.query != "") {
      matchObj.fullName = new RegExp(req.query.query, "i");
    }
    pipeline.push({
      $match: matchObj,
    });
    let ContactArr = await paginateAggregate(Contact, pipeline, req.query);

    res
      .status(201)
      .json({
        message: "found all Device",
        data: ContactArr.data,
        total: ContactArr.total,
      });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.params.id) {
      matchObj._id = new mongoose.Types.ObjectId(req.params.id);
    }
    pipeline.push({
      $match: matchObj,
    });
    let existsCheck = await Contact.aggregate(pipeline);
    if (!existsCheck || existsCheck.length == 0) {
      throw new Error("Banquet does not exists");
    }
    existsCheck = existsCheck[0];
    res.status(201).json({
      message: "found specific Contact",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Contact.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Contact does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }
    let Obj = await Contact.findByIdAndUpdate(req.params.id, req.body).exec();
    res.status(201).json({ message: "Contact Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteContactById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Contact.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Contact does not exists or already deleted");
    }
    await Contact.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Contact Deleted" });
  } catch (error) {
    next(error);
  }
};
