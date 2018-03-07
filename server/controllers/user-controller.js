import User from '../models/user-model';
import passport from 'passport';
import { signToken } from '../helpers/jwt-helper';
import { findUserByUsername } from '../helpers/controller/user-controller-helper';
import {
    buildValidationErrorResponse,
    buildDuplicationErrorResponse,
    buildPostSuccessResponse,
    buildInternalServerErrorResponse,
    buildNotFoundErrorResponse
    } from '../helpers/http-response-helper';

const userController = () => {
    const signUp = async (req, res) => {
        try {
            /* Field validation */
            req.checkBody('username', 'Username is not valid').isEmail().trim();
            req.checkBody('password', 'Password cannot be blank').notEmpty().trim();
            const errors = req.validationErrors();

            if (errors) {
                return buildValidationErrorResponse(res, errors);
            }
            /* End of field Validation */
            const existingUser = await findUserByUsername(req.body.username);

            if (existingUser) {
                return buildDuplicationErrorResponse(res, 'The user exists in system');
            }
            const user = new User(req.body);
            const newUser = await user.save();

            if (newUser) {
                const token = await signToken(newUser);

                return buildPostSuccessResponse(res, { token });
            }
            return buildInternalServerErrorResponse(res);
        } catch (err) {
            return buildInternalServerErrorResponse(res);
        }
    };

    const authenticate = (req, res, next) => {
         /* Field validation */
        req.checkBody('username', 'Username is not valid').isEmail().trim();
        req.checkBody('password', 'Password cannot be blank').notEmpty().trim();

        const errors = req.validationErrors();

        if (errors) {
            return buildValidationErrorResponse(res, errors);
        }
         /* End of field Validation */
        passport.authenticate('local', { session: false }, async (authErr, user) => {
            try {
                if (authErr) {
                    return next(authErr);
                }
                if (!user) {
                    return buildNotFoundErrorResponse(res, 'User not found');
                }
                const token = await signToken(user);

                return buildPostSuccessResponse(res, { token });
            } catch (err) {
                return buildInternalServerErrorResponse(res);
            }
        })(req, res, next);
    };

    return {
        signUp,
        authenticate
    };
};

module.exports = userController;
