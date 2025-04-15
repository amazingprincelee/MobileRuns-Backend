import express from 'express';
import {login, register} from '../controllers/authController.js'
import { authValidator } from '../middlewares/authValidator.js';
const route = express.Router();


route.get("/", (req, res)=>{ res.json("Welcome to MobileRuns")})
route.post("/register", authValidator, register);
route.post("/login", login);








export default route
