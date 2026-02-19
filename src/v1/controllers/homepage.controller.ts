import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { deleteFile, storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Homepage } from "@models/homepage.model";

export const addHomepage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // let existsCheck = await Homepage.findOne({ name: req.body.phone }).exec();
    // if (existsCheck) {
    //     throw new Error("Homepage with same email already exists");
    // }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }

    if (req?.body?.bannerImage && req.body.bannerImage.includes("base64")) {
      req.body.bannerImage = await storeFileAndReturnNameBase64(
        req.body.bannerImage
      );
    }

    console.log("check 2 ", "for check Homepage");
    const homepage = await new Homepage(req.body).save();
    res.status(201).json({ message: "Thank you for filling form " });
  } catch (error) {
    next(error);
  }
};

export const getAllHomepage = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};
    if (req.query.query && req.query.query != "") {
      matchObj.bannerTitle = new RegExp(req.query.query, "i");
    }
    pipeline.push({
      $match: matchObj,
    });
    let HomepageArr = await paginateAggregate(Homepage, pipeline, req.query);

    res.status(201).json({
      message: "found all Device",
      data: HomepageArr.data,
      total: HomepageArr.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getHomepageById = async (
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
    let existsCheck = await Homepage.aggregate(pipeline);
    if (!existsCheck || existsCheck.length == 0) {
      throw new Error("Banquet does not exists");
    }
    existsCheck = existsCheck[0];
    res.status(201).json({
      message: "found specific Homepage",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Homepage.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Homepage does not exists");
    }

    if (req?.body?.bannerImage && req.body.bannerImage.includes("base64")) {
      if (existsCheck?.bannerImage) {
        await deleteFile(existsCheck?.bannerImage);
      }
      req.body.bannerImage = await storeFileAndReturnNameBase64(
        req.body.bannerImage
      );
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }
    let Obj = await Homepage.findByIdAndUpdate(req.params.id, req.body).exec();
    res.status(201).json({ message: "Homepage Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteHomepageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Homepage.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Homepage does not exists or already deleted");
    }
    await Homepage.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Homepage Deleted" });
  } catch (error) {
    next(error);
  }
};

export const activateHomepageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Homepage.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Homepage does not exists");
    }

    // Deactivate all other homepages
    await Homepage.updateMany(
      { _id: { $ne: req.params.id } },
      { $set: { isActive: false } }
    ).exec();

    // Activate the selected homepage
    await Homepage.findByIdAndUpdate(req.params.id, {
      $set: { isActive: true },
    }).exec();

    res.status(201).json({ message: "Homepage Activated" });
  } catch (error) {
    next(error);
  }
};

export const getActiveHomepage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activeHomepage = await Homepage.findOne({ isActive: true })
      .lean()
      .exec();

    if (!activeHomepage) {
      throw new Error("No active homepage found");
    }

    res.status(200).json({
      message: "Active homepage found",
      data: [activeHomepage],
    });
  } catch (error) {
    next(error);
  }
};
