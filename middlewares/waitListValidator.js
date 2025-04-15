import { waitlistSchema } from '../validation/waitingListSchema.js';




export const waitListValidator = async (req, res, next) => {

    try{
        await waitlistSchema.validate(req.body, {abortEarly: false});
        next();
    }catch(error){
        res.status(400).json({
            message: "Wait List Validation failed",
            errors: error.errors
        })
    }

};




