import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        errorMessage: 'Valid Email is Required',
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: 'Email should be a valid email',
        },
    },
    firstName: {
        errorMessage: 'FirstName is Required',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: 'LastName is Required',
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: 'Password is Required',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long',
        },
    },
})
