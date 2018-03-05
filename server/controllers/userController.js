import User from '../models/userModel';
import passport from 'passport';
import { RESPONSE_STATUS } from '../config';
import { signToken } from '../helpers/jwtHelper';
import {
    buildValidationErrorResponse,
    buildDuplicationErrorResponse,
    buildPostSuccessResponse,
    buildInternalServerErrorResponse,
    buildNotFoundErrorResponse
    } from '../helpers/httpResponseHelper';

export const findUserByUsername = async (username) => {
    return await User.findOne({ username: username });
};

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
                const token = signToken(newUser);

                return buildPostSuccessResponse(res, { token });
            } else {
                return buildInternalServerErrorResponse(res);
            }
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
        passport.authenticate('local', { session: false }, (authErr, user) => {
            try {
                if (authErr) {
                    return next(authErr);
                }
                if (!user) {
                    return buildNotFoundErrorResponse(res, 'User not found');
                }
                const token = signToken(user);

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
