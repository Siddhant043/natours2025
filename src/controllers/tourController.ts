import { Request, Response } from "express";
import Tour from "../models/tourModel.js";

const getAllTours = async (req: Request, res: Response) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (matchedStr) => `$${matchedStr}`
    );
    const parsedQuery = JSON.parse(queryStr);
    let query = Tour.find(parsedQuery);

    // Sorting
    if (req.query.sort) {
      const sortStr = req.query.sort.toString();
      const updatedSortStr = sortStr.split(",").join(" ");
      query = query.sort(updatedSortStr);
    }

    // Field Limiting
    if (req.query.fields) {
      const fieldStr = req.query.fields.toString();
      const updatedFieldStr = fieldStr.split(",").join(" ");
      query = query.select(updatedFieldStr);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) {
        throw new Error("This page does not exists");
      }
    }

    const tours = await query;

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
      message: error,
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
      message: "Route is not defined",
    });
  }
};

export { getAllTours, getTour, createTour, updateTour, deleteTour };
