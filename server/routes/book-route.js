import express from 'express';
import bookController from '../controllers/book-controller';
import bookService from '../services/goodreadsService';

const bookRouter = express.Router();
const controller = bookController(bookService());

const router = () => {

    bookRouter.route('/')
        .get(controller.getIndex)
        .post(controller.addBooks);

    bookRouter.use('/:id', controller.getById);
    bookRouter.route('/:id')
        .get(controller.getBookDetail)
        .put(controller.updateBook)
        .delete(controller.removeBook);

    return bookRouter;
};

module.exports = router;
