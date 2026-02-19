import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { deleteFile, storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Testimonial } from "@models/testimonial.model";

export const addTestimonial = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // let existsCheck = await Testimonial.findOne({ name: req.body.phone }).exec();
    // if (existsCheck) {
    //     throw new Error("Testimonial with same email already exists");
    // }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }
    if (req?.body?.userImage && req?.body?.userImage.includes("base64")) {
      req.body.userImage = await storeFileAndReturnNameBase64(
        req.body.userImage
      );
    }

    console.log("check 2 ", "for check Testimonial");
    const testimonial = await new Testimonial(req.body).save();
    res.status(201).json({ message: "Testimonial Added" });
  } catch (error) {
    next(error);
  }
};

export const getAllTestimonial = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.query.query && req.query.query != "") {
      matchObj.name = new RegExp(req.query.query, "i");
    }
    pipeline.push({
      $match: matchObj,
    });
    let TestimonialArr = await paginateAggregate(
      Testimonial,
      pipeline,
      req.query
    );

    res
      .status(201)
      .json({
        message: "found all Device",
        data: TestimonialArr.data,
        total: TestimonialArr.total,
      });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (
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
    let existsCheck = await Testimonial.aggregate(pipeline);
    if (!existsCheck || existsCheck.length == 0) {
      throw new Error("Banquet does not exists");
    }
    existsCheck = existsCheck[0];
    res.status(201).json({
      message: "found specific Testimonial",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonialById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Testimonial.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Testimonial does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }

    if (req?.body?.userImage && req?.body?.userImage.includes("base64")) {
      if (existsCheck?.userImage) {
        await deleteFile(existsCheck?.userImage);
      }
      req.body.userImage = await storeFileAndReturnNameBase64(
        req.body.userImage
      );
    }
    let Obj = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();
    res.status(201).json({ message: "Testimonial Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonialById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Testimonial.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Testimonial does not exists or already deleted");
    }
    await Testimonial.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Testimonial Deleted" });
  } catch (error) {
    next(error);
  }
};
