import express from 'express';
import bookController from '../controllers/book-controller';
import bookService from '../services/goodreadsService';
import { validateRequestBody } from '../validator/book-validator';

const bookRouter = express.Router();
const controller = bookController(bookService());

const router = () => {

    bookRouter.route('/')
        .get(controller.getIndex)
        .post(validateRequestBody, controller.addBooks);

    bookRouter.use('/:id', controller.getById);
    bookRouter.route('/:id')
        .get(controller.getBookDetail)
        .put(validateRequestBody, controller.updateBook)
        .delete(controller.removeBook);

    return bookRouter;
};

module.exports = router;
