import { NextFunction, Request, Response, RequestHandler } from "express";
import { paginateAggregate } from "@helpers/paginateAggregate";
import mongoose, { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "@helpers/fileSystem";
import { Subscriber } from "@models/subscriber.model";
import { MySubscription } from "@models/mySubscription.model";
import { User } from "@models/user.model";

export const addSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await MySubscription.findOne({
      email: req.body.email,
    }).exec();
    if (existsCheck) {
      throw new Error("Subscriber with same email already exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     console.log("first", req.body.imagesArr)
    //     for (const el of req.body.imagesArr) {
    //         if (el.image && el.image !== "") {
    //             el.image = await storeFileAndReturnNameBase64(el.image);
    //         }
    //     }
    // }

    console.log("check 2 ", "for check Subscriber");
    const subscriber = await new Subscriber(req.body).save();
    res.status(201).json({ message: "Subscriber Added" });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriber = async (req: any, res: any, next: any) => {
  try {
    let pipeline: PipelineStage[] = [];

    // First, lookup user details to make their fields available for searching
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    });

    // Unwind user details to make fields accessible
    pipeline.push({
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Now apply search filter after user details are available
    if (req.query.query && req.query.query != "") {
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.name": new RegExp(req.query.query, "i") },
            { "userDetails.email": new RegExp(req.query.query, "i") },
            { "userDetails.phone": new RegExp(req.query.query, "i") },
            { email: new RegExp(req.query.query, "i") }, // If email exists in MySubscription
          ],
        },
      });
    }

    // Lookup subscription details
    pipeline.push({
      $lookup: {
        from: "usersubscriptions",
        localField: "subscriptionId",
        foreignField: "_id",
        as: "subscriptionDetails",
      },
    });

    // Lookup latest payment details
    pipeline.push({
      $lookup: {
        from: "payments",
        let: {
          userId: "$userId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$userId", "$$userId"] }],
              },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 1,
          },
        ],
        as: "latestPayment",
      },
    });

    // Unwind subscription details
    pipeline.push({
      $unwind: {
        path: "$subscriptionDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Unwind payment details
    pipeline.push({
      $unwind: {
        path: "$latestPayment",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Project the final structure
    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        subscriptionId: 1,
        email: 1,
        isDeleted: 1,

        // User details
        userDetails: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          phone: "$userDetails.phone",
        },

        // Subscription details
        subscriptionDetails: {
          _id: "$subscriptionDetails._id",
          name: "$subscriptionDetails.name",
          description: "$subscriptionDetails.description",
          subscriptionType: "$subscriptionDetails.subscriptionType",
          numberOfMonths: "$subscriptionDetails.numberOfMonths",
          actualPrice: "$subscriptionDetails.actualPrice",
          discountedPrice: "$subscriptionDetails.discountedPrice",
          featureArray: "$subscriptionDetails.featureArray",
        },

        // Latest payment details
        latestPayment: {
          _id: "$latestPayment._id",
          amount: "$latestPayment.amount",
          paymentcheck: "$latestPayment.paymentcheck",
          status: "$latestPayment.status",
          message: "$latestPayment.message",
          gatwayPaymentObj: "$latestPayment.gatwayPaymentObj",
          createdAt: "$latestPayment.createdAt",
        },
      },
    });

    let SubscriberArr = await paginateAggregate(
      MySubscription,
      pipeline,
      req.query
    );

    res.status(200).json({
      message: "Found all subscribers with detailed information",
      data: SubscriberArr.data,
      total: SubscriberArr.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];
    let matchObj: Record<string, any> = {};

    if (!req.params.id) {
      throw new Error("Subscriber ID is required");
    }

    matchObj._id = new mongoose.Types.ObjectId(req.params.id);

    pipeline.push({
      $match: matchObj,
    });

    // First get the subscriber details
    pipeline.push({
      $addFields: {
        userIdObj: { $toObjectId: "$userId" },
        subscriptionIdObj: { $toObjectId: "$subscriptionId" },
      },
    });

    // Lookup user details
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userIdObj",
        foreignField: "_id",
        as: "userDetails",
      },
    });

    // Lookup subscription details
    pipeline.push({
      $lookup: {
        from: "usersubscriptions",
        localField: "subscriptionIdObj",
        foreignField: "_id",
        as: "subscriptionDetails",
      },
    });

    // Lookup latest payment details
    pipeline.push({
      $lookup: {
        from: "payments",
        let: {
          userId: "$userIdObj",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$userId", "$$userId"],
              },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 1,
          },
        ],
        as: "latestPayment",
      },
    });

    // Unwind arrays with null preservation
    pipeline.push({
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $unwind: {
        path: "$subscriptionDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $unwind: {
        path: "$latestPayment",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Project the final structure
    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        subscriptionId: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,

        // User details
        userDetails: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          phone: "$userDetails.phone",
        },

        // Subscription details
        subscriptionDetails: {
          _id: "$subscriptionDetails._id",
          name: "$subscriptionDetails.name",
          description: "$subscriptionDetails.description",
          subscriptionType: "$subscriptionDetails.subscriptionType",
          numberOfMonths: "$subscriptionDetails.numberOfMonths",
          actualPrice: "$subscriptionDetails.actualPrice",
          discountedPrice: "$subscriptionDetails.discountedPrice",
          featureArray: "$subscriptionDetails.featureArray",
        },

        // Latest payment details
        latestPayment: {
          $cond: {
            if: { $ifNull: ["$latestPayment", false] },
            then: {
              _id: "$latestPayment._id",
              amount: "$latestPayment.amount",
              paymentcheck: "$latestPayment.paymentcheck",
              status: "$latestPayment.status",
              message: "$latestPayment.message",
              gatwayPaymentObj: "$latestPayment.gatwayPaymentObj",
              createdAt: "$latestPayment.createdAt",
            },
            else: null,
          },
        },
      },
    });

    const existsCheck = await MySubscription.aggregate(pipeline);

    if (!existsCheck || existsCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found specific subscriber with detailed information",
      data: existsCheck[0],
    });
  } catch (error) {
    next(
      new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching subscriber details"
      )
    );
  }
};

// Optional: Add a function to get subscriber with payment history
export const getSubscriberWithPaymentHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscriberId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    let pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: {
        _id: new mongoose.Types.ObjectId(subscriberId),
      },
    });

    // Get subscriber details with user and subscription info
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    });

    pipeline.push({
      $lookup: {
        from: "subscriptions",
        localField: "subscriptionId",
        foreignField: "_id",
        as: "subscriptionDetails",
      },
    });

    // Get paginated payment history
    pipeline.push({
      $lookup: {
        from: "payments",
        let: {
          userId: "$userId",
          subscriptionId: "$subscriptionId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$userId"] },
                  { $eq: ["$subscriptionId", "$$subscriptionId"] },
                ],
              },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $skip: (Number(page) - 1) * Number(limit),
          },
          {
            $limit: Number(limit),
          },
        ],
        as: "paymentHistory",
      },
    });

    // Get total payment count
    pipeline.push({
      $lookup: {
        from: "payments",
        let: {
          userId: "$userId",
          subscriptionId: "$subscriptionId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$userId"] },
                  { $eq: ["$subscriptionId", "$$subscriptionId"] },
                ],
              },
            },
          },
          {
            $count: "total",
          },
        ],
        as: "paymentCount",
      },
    });

    const result = await MySubscription.aggregate(pipeline);

    if (!result || result.length === 0) {
      throw new Error("Subscriber does not exist");
    }

    const subscriber = result[0];
    const totalPayments = subscriber.paymentCount[0]?.total || 0;

    res.status(200).json({
      message: "Found subscriber with payment history",
      data: {
        subscriber: {
          _id: subscriber._id,
          userId: subscriber.userId,
          subscriptionId: subscriber.subscriptionId,
          userDetails: subscriber.userDetails[0],
          subscriptionDetails: subscriber.subscriptionDetails[0],
        },
        paymentHistory: subscriber.paymentHistory,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalPayments / Number(limit)),
          totalPayments,
          hasNext: Number(page) * Number(limit) < totalPayments,
          hasPrev: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await MySubscription.findById(req.params.id)
      .lean()
      .exec();
    if (!existsCheck) {
      throw new Error("Subscriber does not exists");
    }

    // if (req.body.imagesArr && req.body.imagesArr.length > 0) {
    //     for (const el of req.body.imagesArr) {
    //         if (el.images && el.images !== "" && el.images.includes("base64")) {
    //             el.images = await storeFileAndReturnNameBase64(el.images);
    //         }
    //     }
    // }
    let Obj = await Subscriber.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();
    res.status(201).json({ message: "Subscriber Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let existsCheck = await Subscriber.findById(req.params.id).exec();
    if (!existsCheck) {
      throw new Error("Subscriber does not exists or already deleted");
    }
    await Subscriber.findByIdAndDelete(req.params.id).exec();
    res.status(201).json({ message: "Subscriber Deleted" });
  } catch (error) {
    next(error);
  }
};
