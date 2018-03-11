import express from 'express';
import bookRouter from './book-route';
import authRouter from './auth-route';
import acl from 'express-acl';

const router = express.Router();

acl.config(
    {
        filename: 'nacl.json',
        baseUrl: 'api',
        defaultRole: 'guest'
    },
    {
        status: 'fail',
        data: [
            {
                msg: 'You are not authorized to access this resource'
            }
        ]
    }
);

router.use(acl.authorize.unless({
    path: [
        '/api/auth/signUp',
        '/api/auth/signIn'
    ]
}));

router.use('/books', bookRouter());
router.use('/auth', authRouter());
router.get('/', (req, res) => {
    res.send('Login page');
});

module.exports = router;
