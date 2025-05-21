import express from "express";
import cors from "cors";
import { connect } from "./config/db.js";
import dotenv from "dotenv";
import { createServer } from "http";
import contactRoute from "./routes/contactRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import chatRoute from "./routes/chatRoute.js";
import locationRoute from "./routes/locationRoute.js";
import callRoute from "./routes/callRoute.js";
import initializeSocket from "./config/socket.js";

const app = express();
const httpServer = createServer(app);
dotenv.config();

app.use(cors({
  origin: '*'
}))

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
app.use("/api", adminRoute);
app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api", chatRoute);
app.use("/api", locationRoute);
app.use("/api", callRoute);

// Initialize Socket.IO
const io = initializeSocket(httpServer);



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Service is running on Port ${port}`);
});