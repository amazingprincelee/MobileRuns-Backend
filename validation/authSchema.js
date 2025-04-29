import {object, string} from 'yup';



export const authSchema = object({
    identifier: string().required("Email or Phone number is required"),
    password: string().min(8, "Password must be more than 8 characters").required("Password is required"),
    role: string().oneOf(["client", "provider", "admin", "superAdmin"], "Role must be either client, provider, admin, or superAdmin").required("Role is required"),
})



