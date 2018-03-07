import {
    buildValidationErrorResponse
  } from '../helpers/http-response-helper';

module.exports = {
    validateRequestBody: async (req, res, next) => {
        req.checkBody('username', 'Username is not valid').isEmail().trim();
        req.checkBody('password', 'Password cannot be blank').notEmpty().trim();
        const errors = await req.validationErrors();

        if (errors) {
            return buildValidationErrorResponse(res, errors);
        }
        next();
    }
};
