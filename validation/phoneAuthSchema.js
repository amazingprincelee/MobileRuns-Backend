import { object, string } from 'yup';

export const phoneVerificationSchema = object({
    phone: string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number must be in international format')
        .required('Phone number is required'),
});

export const verifyCodeSchema = object({
    phone: string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number must be in international format')
        .required('Phone number is required'),
    code: string()
        .matches(/^\d{6}$/, 'Verification code must be 6 digits')
        .required('Verification code is required'),
});