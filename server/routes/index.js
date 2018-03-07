import express from 'express';
import bookRouter from './book-route';
import authRouter from './auth-route';

const router = express.Router();

router.use('/books', bookRouter());
router.use('/auth', authRouter());
router.get('/', (req, res) => {
    res.send('Login page');
});

module.exports = router;
