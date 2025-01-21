import express, { Application, Request, Response } from "express";

const app: Application = express();

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on Port: ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello form server");
});
