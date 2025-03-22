import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.patch("/updatePassword", protect, updatePassword);

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
