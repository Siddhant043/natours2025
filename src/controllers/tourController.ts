import { Request, Response } from "express";
import Tour from "../models/tourModel.js";

const getAllTours = async (_req: Request, res: Response) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Unable to find tours",
    });
  }
};

const getTour = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "A Tour must have a name and price",
    });
  }
};

const updateTour = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

const deleteTour = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

export { getAllTours, getTour, createTour, updateTour, deleteTour };
