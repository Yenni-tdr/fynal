import * as Yup from "yup";

export const baseDataSchema = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .required("First name is required")
        .matches(/^[A-Za-z\-]{1,20}$/),
    lastName: Yup.string()
        .trim()
        .required("Last name is required")
        .matches(/^[A-Za-z ]{1,20}$/),
    email: Yup.string()
        .trim()
        .required("Email is required")
        .email("Email is not valid"),
});

export const passwordSchema = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(8)
        .max(25)
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?]{8,}$/),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const registerSchema =  baseDataSchema.concat(passwordSchema);

export const signInSchema = Yup.object().shape({
    email: Yup.string().email("Email is not valid").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export const saltRounds = 10;
export const SESSION_NAME = 'myapp_session';
