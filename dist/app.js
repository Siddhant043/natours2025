import express from "express";
const app = express();
const port = 8000;
app.listen(port, () => {
    console.log(`App is running on Port: ${port}`);
});
app.get("/", (req, res) => {
    res.status(200).send("Hello form server");
});
//# sourceMappingURL=app.js.map