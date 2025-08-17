// validationSchemas.ts
import * as yup from 'yup';

export const orgRegistrationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Organization name is required")
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be less than 100 characters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
      .string()
      .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .matches(/[a-z]/, "Password Must contain a lowercase letter")
    .matches(/[A-Z]/, "Password Must contain an uppercase letter")
    .matches(/[0-9]/, "Password Must contain a number")
    .matches(/[@$!%*?&#]/, "Password Must contain a special character"),

  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),

  industry: yup
    .string()
    .trim()
    .required("Industry is required"),

  location: yup
    .string()
    .trim()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(30, "Location too long"),

  phoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(
      /^[\d+\-() ]{7,15}$/,
      "Invalid phone number format"
    ),

 

  website: yup
    .string()
    .trim()
    .url("Invalid website URL")
    .notRequired(),

});
