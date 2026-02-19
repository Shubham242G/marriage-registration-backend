import indexRouter from "@routesv1/index.routes";
import userRouter from "@routesv1/user.routes";
import express from "express";
import subscriptionRouter from "@routesv1/subscription.routes";
import paymentRouter from "@routesv1/payment.routes";
import documentRouter from "@routesv1/document.routes";
import contactRouter from "@routesv1/contact.routes";
import homepageRouter from "@routesv1/homepage.routes";
import subscriberRouter from "@routesv1/subscriber.routes";
import testimonialRouter from "@routesv1/testimonial.routes";
import blogRouter from "@routesv1/blog.routes";
import categoryRouter from "@routesv1/category.routes";
import couponRouter from "@routesv1/coupon.routes";



const router = express.Router();

router.use("/", indexRouter);
router.use("/users", userRouter);
router.use("/subscription", subscriptionRouter);
router.use("/payment", paymentRouter);
router.use("/document", documentRouter);
router.use("/contact", contactRouter);
router.use("/homepage", homepageRouter);
router.use("/subscriber", subscriberRouter);
router.use("/testimonial", testimonialRouter);
router.use("/blog", blogRouter);
router.use("/category", categoryRouter);
router.use("/coupon", couponRouter);
// =======<ryz>====== //

// router.use("/log", LogRouter)

// =======<>====== //

export default router;
