import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Category } from "@models/category.model"




export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {


        let existsCheck = await Category.findOne({ name: req.body.name }).exec();
        if (existsCheck) {
            throw new Error("Category with same email already exists");
        }

        // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
        //     console.log("first", req.body.imagesArr)
        //     for (const el of req.body.imagesArr) {
        //         if (el.image && el.image !== "") {
        //             el.image = await storeFileAndReturnNameBase64(el.image);
        //         }
        //     }
        // }

        console.log(
            "check 2 ", "for check Category"
        )
        const category = await new Category(req.body).save();
        res.status(201).json({ message: "Category Added" });


    } catch (error) {
        next(error);
    }
};

export const getAllCategory = async (req: any, res: any, next: any) => {
    try {
        let pipeline: PipelineStage[] = [];
        let matchObj: Record<string, any> = {};
        if (req.query.query && req.query.query != "") {
            matchObj.name = new RegExp(req.query.query, "i");
        }
        pipeline.push({
            $match: matchObj,
        });
        let CategoryArr = await paginateAggregate(Category, pipeline, req.query);

        res.status(201).json({ message: "found all Device", data: CategoryArr.data, total: CategoryArr.total });
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pipeline: PipelineStage[] = [];
        let matchObj: Record<string, any> = {};
        if (req.params.id) {
            matchObj._id = new mongoose.Types.ObjectId(req.params.id);
        }
        pipeline.push({
            $match: matchObj,
        });
        let existsCheck = await Category.aggregate(pipeline);
        if (!existsCheck || existsCheck.length == 0) {
            throw new Error("Banquet does not exists");
        }
        existsCheck = existsCheck[0];
        res.status(201).json({
            message: "found specific Category",
            data: existsCheck,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let existsCheck = await Category.findById(req.params.id).lean().exec();
        if (!existsCheck) {
            throw new Error("Category does not exists");
        }

        // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
        //     for (const el of req.body.imagesArr) {
        //         if (el.images && el.images !== "" && el.images.includes("base64")) {
        //             el.images = await storeFileAndReturnNameBase64(el.images);
        //         }
        //     }
        // }
        let Obj = await Category.findByIdAndUpdate(req.params.id, req.body).exec();
        res.status(201).json({ message: "Category Updated" });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let existsCheck = await Category.findById(req.params.id).exec();
        if (!existsCheck) {
            throw new Error("Category does not exists or already deleted");
        }
        await Category.findByIdAndDelete(req.params.id).exec();
        res.status(201).json({ message: "Category Deleted" });
    } catch (error) {
        next(error);
    }
};







