import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { UserSubscription } from "@models/userSubscription.model";

export const addSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await UserSubscription.findOne({
      $or: [{ phone: req.body.phone }, { email: req.body.email }],
      isDeleted: false,
    }).exec();
    if (existsCheck) {
      throw new Error("Subscription with same email and phone already exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }

    console.log("check 2 ", "for check Subscription");
    const Subscription = await new UserSubscription(req.body).save();
    res.status(201).json({ message: "Subscription Created" });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscription = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.query.query && req.query.query != "") {
      matchObj.name = new RegExp(req.query.query, "i");
    }
    pipeline.push({
      $match: matchObj,
    });
    let SubscriptionArr = await paginateAggregate(
      UserSubscription,
      pipeline,
      req.query
    );

    res
      .status(201)
      .json({
        message: "found all Device",
        data: SubscriptionArr.data,
        total: SubscriptionArr.total,
      });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (
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
    let existsCheck = await UserSubscription.aggregate(pipeline);
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

export const updateSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await UserSubscription.findById(req.params.id)
      .lean()
      .exec();
    if (!existsCheck) {
      throw new Error("Subscription does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }
    let Obj = await UserSubscription.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();
    res.status(201).json({ message: "Subscription Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await UserSubscription.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Subscription does not exists or already deleted");
    }
    await UserSubscription.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Subscription Deleted" });
  } catch (error) {
    next(error);
  }
};
