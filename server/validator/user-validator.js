import {
  VALIDATION_ERROR
} from '../config/constants';

module.exports = {
    validateRequestBody: async (req, res, next) => {
        req.checkBody('username', 'Username is not valid').isEmail().trim();
        req.checkBody('password', 'Password cannot be blank').notEmpty().trim();
        const errors = await req.validationErrors();

        if (errors) {
            return next( { status: VALIDATION_ERROR, errors });
        }
        next();
    }
};
