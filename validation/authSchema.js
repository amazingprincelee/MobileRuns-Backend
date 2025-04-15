import {object, string} from 'yup';



export const authSchema = object({
    email: string().email("Please provide a valid mail").required("Email is required"),
    password: string().min(8, "Password must be more than 8 characters").required("Password is required"),
    role: string().required("Role is required"),
})



