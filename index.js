require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

// database
const database = require("./DB/connectDB");

// == cors option == //
const corsOption = {
  origin: "*",
  certificate: true,
  optionSuccessStatus: 200,
};

// Routes
const userRoute = require("./Routes/userRoutes");
const jobRoute = require("./Routes/jobRoutes");
const { verifyUserToken } = require("./Middlewares/verifyUser");

const { NotFoundError } = require("./Errors/index");
const generalErrorAPI = require("./Middlewares/generalErrors");

// == Middlewares == //
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// == Routes == //
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/job", verifyUserToken, jobRoute);

// == Error Routes == //
app.use(NotFoundError);
app.use(generalErrorAPI);

// == Database and Server Connection == //
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // database connection
    await database(process.env.MONGO_URL);
    app.listen(PORT, () =>
      console.log(`Database connected and Server running on port : ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
