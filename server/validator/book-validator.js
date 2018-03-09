import {
  VALIDATION_ERROR
} from '../config/constants';

module.exports = {
    validateRequestBody: async (req, res, next) => {
        req.checkBody('title', 'Title cannot be blank').notEmpty().trim();
        req.checkBody('author', 'Author cannot be blank').notEmpty().trim();
        req.checkBody('genre').trim();
        req.checkBody('read', 'Read is must boolean type').isBoolean().trim();

        const errors = req.validationErrors();

        if (errors) {
            return next( { status: VALIDATION_ERROR, errors });
        }
        next();
    }
};
