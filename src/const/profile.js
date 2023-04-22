import * as Yup from "yup";


export const idUserSchema = Yup.object().shape({
    userId: Yup.number()
})

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

export const otherProfileDataSchema = Yup.object().shape({
    birthDate: Yup.date()
        .nullable()
        //.min(new Date().setFullYear(new Date().getFullYear()-150), "Erreur de la date de naissance")
        .max(new Date(), "Erreur de la date de naissance"),
    sex: Yup.string()
        .nullable()
        .oneOf(["Homme", "Femme", "Autre"], "Erreur lors du choix du genre")
})

export const signInSchema = Yup.object().shape({
    email: Yup.string().email("Email is not valid").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export const addressSchema = Yup.object().shape({
    addressBody: Yup.string()
        .when(['addressAddition', 'postcode', 'city', 'country'],{
            is: (addressAddition, postcode, city, country) => addressAddition || postcode || city || country,
            then: Yup.string().required()
        }),
    addressAddition: Yup.string(),
    postcode: Yup.number().min(5).max(5)
        .when(['addressBody', 'addressAddition', 'city', 'country'], {
            is: (addressBody, addressAddition, city, country) => addressBody || addressAddition || city || country,
            then: Yup.string().required()
        }),
    city: Yup.string()
        .when(['addressBody', 'addressAddition', 'postcode', 'country'], {
            is: (addressBody, addressAddition, postcode, country) => addressBody || addressAddition || postcode || country,
            then: Yup.string().required()
        }),
    country: Yup.string()
        .when(['addressBody', 'addressAddition', 'postcode', 'city'], {
            is: (addressBody, addressAddition, postcode, city) => addressBody || addressAddition || postcode || city,
            then: Yup.string().required()
        }),
},
[
    ['addressBody', 'addressAddition'], ['addressBody', 'postcode'], ['addressBody', 'city'], ['addressBody', 'country'],
    ['postcode', 'addressAddition'], ['postcode', 'city'], ['postcode', 'country'],
    ['city', 'addressAddition'], ['city', 'country'],
    ['country', 'addressAddition']
])

export const registerSchema =  baseDataSchema.concat(passwordSchema);
export const profileSchema = baseDataSchema.concat(otherProfileDataSchema);
export const saltRounds = 10;
export const SESSION_NAME = 'fynal_session';
