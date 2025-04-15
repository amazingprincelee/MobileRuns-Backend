import {object, string} from 'yup';




export const waitlistSchema =  object({
    fullName: string().required("Fullname full name is required"),
    location: string().required("your location is required"),
    email: string().required("Email address is required").email("Invalid Email"),
    role: string().required("Select Service Provider or Client"),
    phone:  string().required('Phone number is required') .matches(/^\+?\d{7,15}$/, 'Phone number must be valid'),
})




