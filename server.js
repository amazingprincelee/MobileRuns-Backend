import express from "express";
import cors from "cors";
import { connect } from "./config/db.js";
import dotenv from "dotenv";
import contactRoute from "./routes/contactRoute.js";
import authRoute from "./routes/authRoute.js";

const app = express();
dotenv.config();

app.use(cors())

// Define allowed origins
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "http://mobileruns.com", 

// ];

// Configure CORS
// app.use(
//   cors({
//     origin: (origin, callback) => {
      
//       if (!origin) return callback(null, true);
     
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: false,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connect();

app.use("/api", contactRoute);
app.use("/api", authRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Service is running on Port ${port}`);
});