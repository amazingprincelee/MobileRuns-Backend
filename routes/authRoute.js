import express from 'express';
import {login, register} from '../controllers/authController.js'
import { authValidator } from '../middlewares/authValidator.js';
const route = express.Router();



route.post("/register", authValidator, register);
route.post("/login", login);








export default route
