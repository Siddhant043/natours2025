import { Request, Response } from "express";
import { TOURS } from "../app.js";

const getAllTours = (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    results: TOURS.length,
    data: {
      tours: TOURS,
    },
  });
};

const getTour = (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const tour = TOURS.find((tour) => tour.id === id);
  if (!tour) {
    res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req: Request, res: Response) => {
  const id = TOURS[TOURS.length - 1].id + 1;
  const newTour = Object.assign({ id: id }, req.body);
  TOURS.push(newTour);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
};

const updateTour = (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const tour = TOURS.find((tour) => tour.id === id);

  if (!tour) {
    res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });
  }
  const newTourData = req.body;
  const updatedTour = { ...tour, ...newTourData };
  TOURS.push(updatedTour);
  res.status(203).json({
    status: "success",
    data: {
      tour: updatedTour,
    },
  });
};

const deleteTour = (req: Request, res: Response) => {
  const tourId = Number(req.params);
  if (tourId > TOURS.length) {
    res.status(404).json({
      status: "failed",
      message: "Tour not found",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

export { getAllTours, getTour, createTour, updateTour, deleteTour };
