import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import router from "./routes/routes.js";
import connectDB from "./db/index.js";

// Some Configuration and Some important Variable
const app = express();
app.set("View Engine", "ejs");

dotenv.config();
const PORT = process.env.PORT || 3000;


// Connect MongoDB Database
connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Application is listening on Port http://localhost:${PORT}`);
    })
  )
  .catch((error) => {
    console.log("Error occurred at ./main.js ----->", error);
  });


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "My Secret Key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use(express.static("uploads"));


app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// set Template engine
app.use("", router);
