import JWT from 'jsonwebtoken';
import { findUserByUsername } from './controller/user-controller-helper';
import {
  UNAUTHORIZED_RESOURCE_ERROR,
  INTERNAL_SERVER_ERROR
} from '../config/constants';

exports.verifyToken = (req, res, next) => {
    try {
        if (req.path !== '/api/auth/signIn' && req.path !== '/api/auth/signUp' && req.path !== '/api') {
            const token = req.headers[ 'x-access-token' ];

            if (!token) {
                return next({ status: UNAUTHORIZED_RESOURCE_ERROR, msg: 'No token provided' });
            }
            JWT.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return next({ status: INTERNAL_SERVER_ERROR });
                }
                const user = await findUserByUsername(decoded.user.id);

                if (user) {
                    req.decoded = decoded;
                    next();
                } else {
                    next({ status: UNAUTHORIZED_RESOURCE_ERROR });
                }
            });
        } else {
            next();
        }
    } catch (err) {
        return next({ status: INTERNAL_SERVER_ERROR });
    }
};

const cleanUser = (user) => {
    return {
        id: user.username
    };
};

exports.signToken = async (user) => {
    return await JWT.sign({
        iss: 'ApiAuth',
        user: cleanUser(user),
        role: user.role,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_SECRET);
};
