import JWT from 'jsonwebtoken';
import { findUserByUsername } from '../controllers/userController';

const verifyToken = (req, res, next) => {
    try {
        if (req.path !== '/auth/signIn' && req.path !== '/auth/signUp' && req.path !== '/') {
            const token = req.headers[ 'x-access-token' ];

            if (!token) {
                return res.status(403).send({ auth: false, message: 'No token provided.' });
            }
            JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                }
                const user = findUserByUsername(decoded.id);

                if (user) {
                    next();
                } else {
                    return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
                }
            });
        } else {
            next();
        }
    } catch (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
};


const signToken = (user) => {
    return JWT.sign({
        iss: 'ApiAuth',
        id: user.username,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_SECRET);
};


module.exports = {
    signToken,
    verifyToken
};
