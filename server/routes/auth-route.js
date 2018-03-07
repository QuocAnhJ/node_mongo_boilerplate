import express from 'express';
import userController from '../controllers/user-controller';
import { validateRequestBody } from '../validator/user-validator';

const authRouter = express.Router();
const controller = userController();

const router = () => {
    authRouter.route('/signUp')
      .post(validateRequestBody, controller.signUp);

    authRouter.route('/signIn')
      .post(validateRequestBody, controller.authenticate);

    return authRouter;
};

module.exports = router;
