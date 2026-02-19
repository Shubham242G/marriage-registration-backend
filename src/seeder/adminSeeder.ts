import { ROLES } from "@common/constant.common";
import { encryptPassword } from "@helpers/bcrypt";
import { User } from "@models/user.model";
import mongoose from "mongoose";

export const adminSeeder = async () => {
   try {
      await mongoose.connection.collection("users").dropIndex("username_1");
      console.log("✅ Dropped stale username_1 index");
    } catch (e: any) {
      // Index doesn't exist — that's fine, ignore
    }

  try {
    const encryptedPassword = await encryptPassword("123456");
    const adminExist = await User.findOne({ role: ROLES.ADMIN }).exec();
    if (adminExist) {
      return "Admin already exists";
    }

    await new User({
      name: "Admin",
      username: "admin",
      email: "admin@admin.com",
      password: encryptedPassword,
      role: ROLES.ADMIN,
      approved: true,
    }).save();
  } catch (error) {
    console.error(error);
  }
};
