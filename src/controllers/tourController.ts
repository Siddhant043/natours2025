import { NextFunction, Request, Response } from "express";
import Tour from "../models/tourModel.js";
import APIFeatures from "../utils/apiFeatures.js";

const aliasTopTours = (req: Request, _res: Response, next: NextFunction) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty,summary";
  next();
};

const getAllTours = async (req: Request, res: Response) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "Unable to find tours",
    });
  }
};

const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Unable to find tour",
    });
  }
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
      error: error,
    });
  }
};

const updateTour = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Unable to update the Tour",
    });
  }
};

const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error,
    });
  }
};

const getTourStats = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          totalTours: { $sum: 1 },
          totalRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: "easy" } },
      // },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Unable to find Tours",
      error: error,
    });
  }
};

const getMonthlyPlan = async (req: Request, res: Response) => {
  try {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Unable to find Tours",
      error: error,
    });
  }
};

export {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
