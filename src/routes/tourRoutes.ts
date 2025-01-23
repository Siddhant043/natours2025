import express, { Request, Response } from "express";
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from "../controllers/tourController.js";

const tourRouter = express.Router();
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
