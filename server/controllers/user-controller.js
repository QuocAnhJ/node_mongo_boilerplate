import User from '../models/user-model';
import passport from 'passport';
import { signToken } from '../helpers/jwt-helper';
import { findUserByUsername } from '../helpers/controller/user-controller-helper';
import {
  ENTITY_DUPLICATION_ERROR,
  ENTITY_NOT_FOUND_ERROR,
  OK
} from '../config/constants';

const userController = () => {
    const signUp = async (req, res, next) => {
        try {
            const existingUser = await findUserByUsername(req.body.username);

            if (existingUser) {
                /** Pass error to errorHandler */
                return next( { status: ENTITY_DUPLICATION_ERROR });
            }
            const user = new User(req.body);
            const newUser = await user.save();

            if (newUser) {
                const token = await signToken(newUser);

                return next({ status: OK, data: { token } });
            }
            return next( { status: INTERNAL_SERVER_ERROR });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    const authenticate = (req, res, next) => {
        passport.authenticate('local', { session: false }, async (authErr, user) => {
            try {
                if (authErr) {
                    return next( { status: INTERNAL_SERVER_ERROR });
                }
                if (!user) {
                    return next({ status: ENTITY_NOT_FOUND_ERROR, msg: 'Username/password is not correct' });
                }
                const token = await signToken(user);

                return next({ status: OK, data: { token } });
            } catch (err) {
                return next( { status: INTERNAL_SERVER_ERROR });
            }
        })(req, res, next);
    };

    return {
        signUp,
        authenticate
    };
};

module.exports = userController;
