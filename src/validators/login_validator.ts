import { body, checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        errorMessage: 'Valid Email is Required',
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: 'Email should be a valid email',
        },
    },
    password: {
        errorMessage: 'Password is Required',
        notEmpty: true,
        trim: true,
    },
})
