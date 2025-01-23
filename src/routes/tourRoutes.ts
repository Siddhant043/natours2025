import express, { Request, Response } from "express";
import {
  checkId,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from "../controllers/tourController.js";

const tourRouter = express.Router();

tourRouter.param("id", checkId);

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
