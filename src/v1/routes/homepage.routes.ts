import express from "express";
import { authorizeJwt } from "@middlewares/auth.middleware";
import {
  addHomepage,
  deleteHomepageById,
  getHomepageById,
  updateHomepageById,
  getAllHomepage,
  activateHomepageById,
  getActiveHomepage,
} from "../controllers/homepage.controller";
import { upload } from "@middlewares/multer.middleware";
const router = express.Router();

router.post("/", addHomepage);
router.get("/", getAllHomepage);
router.get("/active", getActiveHomepage);
router.get("/getById/:id", getHomepageById);
router.patch("/updateById/:id", updateHomepageById);
router.delete("/deleteById/:id", deleteHomepageById);
router.patch("/activate/:id", activateHomepageById);

export default router;
