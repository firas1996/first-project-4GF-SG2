const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection established !!!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}...`);
});
