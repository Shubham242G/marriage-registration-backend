import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { deleteFile, storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Blog } from "@models/blog.model";

export const addBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // let existsCheck = await Blog.findOne({ name: req.body.phone }).exec();
    // if (existsCheck) {
    //     throw new Error("Blog with same email already exists");
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


    const log = await new Blog(req.body).save();
    res.status(201).json({ message: "Blog Added " });
  } catch (error) {
    next(error);
  }
};

export const getAllBlog = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryObj",
        },
      },
      {
        $unwind: {
          path: "$categoryObj",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          categoryName: "$categoryObj.name",
        },
      },
      {
        $unset: "categoryObj",
      },
    ];
    let matchObj: Record<string, any> = {};
    if (req.query.query && req.query.query != "") {
      matchObj.bannerTitle = new RegExp(req.query.query, "i");
    }

    if (req.query?.categoryId) {
      matchObj.categoryId = new mongoose.Types.ObjectId(req.query.categoryId);
    }
    pipeline.push({
      $match: matchObj,
    });
    let BlogArr = await paginateAggregate(Blog, pipeline, req.query);

    res
      .status(201)
      .json({
        message: "found all Device",
        data: BlogArr.data,
        total: BlogArr.total,
      });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (
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
    let existsCheck = await Blog.aggregate(pipeline);
    if (!existsCheck || existsCheck.length == 0) {
      throw new Error("Banquet does not exists");
    }
    existsCheck = existsCheck[0];
    res.status(201).json({
      message: "found specific Blog",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Blog.findById(req.params.id).lean().exec();
    if (!existsCheck) {
      throw new Error("Blog does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }

    if (req?.body?.bannerImage && req.body.bannerImage.includes("base64")) {
      if (existsCheck?.bannerImage) {
        await deleteFile(existsCheck?.bannerImage);
      }
      req.body.bannerImage = await storeFileAndReturnNameBase64(
        req.body.bannerImage
      );
    }
    let Obj = await Blog.findByIdAndUpdate(req.params.id, req.body).exec();
    res.status(201).json({ message: "Blog Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Blog.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Blog does not exists or already deleted");
    }
    await Blog.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Blog Deleted" });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.slug) {
      throw new Error("slug is required");
    }
    let existsCheck = await Blog.findOne({ slug: req.params.slug }).exec();
    if (!existsCheck) {
      throw new Error("Blog does not exists");
    }

    res.status(201).json({
      message: "found specific Blog",
      data: existsCheck,
    });
  } catch (error) {
    next(error);
  }
};
