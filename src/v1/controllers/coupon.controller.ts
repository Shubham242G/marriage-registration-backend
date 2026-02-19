import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Coupon } from "@models/coupon.model";

export const addCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // let existsCheck = await Coupon.findOne({ name: req.body.phone }).exec();
    // if (existsCheck) {
    //     throw new Error("Coupon with same email already exists");
    // }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }

    console.log("check 2 ", "for check Coupon");
    const coupon = await new Coupon(req.body).save();
    res.status(201).json({ message: "Coupon Created" });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupon = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.query.query && req.query.query != "") {
      matchObj.code = new RegExp(req.query.query, "i");
    }
    pipeline.push({
      $match: matchObj,
    });
    let couponArr = await paginateAggregate(Coupon, pipeline, req.query);

    res.status(201).json({
      message: "found all Device",
      data: couponArr.data,
      total: couponArr.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (
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
    let existsCheck = await Coupon.aggregate(pipeline);
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

export const updateCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Coupon.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Coupon does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }
    let Obj = await Coupon.findByIdAndUpdate(req.params.id, req.body).exec();
    res.status(201).json({ message: "Coupon Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Coupon.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Coupon does not exists or already deleted");
    }
    await Coupon.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Coupon Deleted" });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, value: orderValue } = req.body;

    let coupon = await Coupon.findOne({ code, isActive: true }).exec();

    console.log("coupon", coupon); // Add this line to log the coupon
    if (!coupon) {
      throw new Error("Coupon does not exist or is inactive");
    }
    if (coupon.expiresAt < new Date()) {
      throw new Error("Coupon has expired");
    }
    if (coupon.usedCount >= coupon.maxUsageCount) {
      throw new Error("Coupon usage limit reached");
    }
    if (orderValue < coupon.minOrderValue) {
      throw new Error(
        `Order value is less than the minimum ${coupon.minOrderValue}Rs required to apply this coupon`
      );
    }
    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      let discount1 = (orderValue * coupon.discountPercentage) / 100;
      let discount2 = coupon.discountValue;
      if(discount2 ===0){
        discount2 = (orderValue * coupon.discountPercentage) / 100;
      }
      discount = Math.min(discount1, discount2);
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { usedCount: 1 },
    }).exec();

    res.status(200).json({ message: "Coupon applied successfully", discount });
  } catch (error) {
    next(error);
  }
};
