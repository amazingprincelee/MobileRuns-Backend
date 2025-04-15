import { authSchema } from '../validation/authSchema.js'




export const authValidator = async (req, res, next) => {
    
    try{

        await authSchema.validate(req.body, {abortEarly: false});
        next();

    }catch(error){

        res.status(400).json({
            message: "Auth Validation Fail",
            errors: error.errors
        })

    }
}