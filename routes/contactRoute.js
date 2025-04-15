import express from 'express';
const route = express.Router();
import { waitList, getWaitlist } from '../controllers/contactController.js';
import { waitListValidator } from '../middlewares/waitListValidator.js'




route.post("/join-waitlist", waitListValidator, waitList);
route.get("/waitlist", getWaitlist);




export default route;



