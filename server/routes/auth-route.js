import express from 'express';
import userController from '../controllers/user-controller';

const authRouter = express.Router();
const controller = userController();

const router = () => {
    authRouter.route('/signUp')
      .post(controller.signUp);

    authRouter.route('/signIn')
      .post(controller.authenticate);

    return authRouter;
};

module.exports = router;
