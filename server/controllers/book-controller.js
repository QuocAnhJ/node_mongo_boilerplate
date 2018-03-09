import Book from '../models/book-model';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  ENTITY_NOT_FOUND_ERROR
} from '../config/constants';

const bookController = (bookService) => {
    const getIndex = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await Book.find(query);

            return next({ status: OK, data: { books: result } });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    const addBooks = async (req, res, next) => {
        try {
            const book = new Book(req.body);
            const newBook = await book.save();

            if (newBook) {
                return next({ status: OK, data: { book: newBook } });
            }
            return next( { status: INTERNAL_SERVER_ERROR });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    const getById = async (req, res, next) => {
        try {
            let result = await Book.findById(req.params.id);

            if (result) {
                req.book = result;
                return next();
            }
            return next({ status: ENTITY_NOT_FOUND_ERROR });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    const getBookDetail = async (req, res, next) => {
        try {
            const book = await bookService.getBookById(req.book._id);

            return next({ status: OK, data: { book } });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    const updateBook = async (req, res, next) => {
        try {
            let book = new Book(req.book);

            book.title = req.body.title;
            book.author = req.body.author;
            book.read = req.body.read;
            book.genre = req.body.genre;
            const updatedBook = await book.save();

            if (updatedBook) {
                return next({ status: OK, data: { book: updatedBook } });
            }
            return next( { status: INTERNAL_SERVER_ERROR });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    const removeBook = async (req, res, next) => {
        try {
            let book = req.book;
            const removedBook = await book.remove();

            if (removedBook) {
                return next({ status: OK, data: null });
            }
            return next( { status: INTERNAL_SERVER_ERROR });
        } catch (err) {
            return next( { status: INTERNAL_SERVER_ERROR });
        }
    };

    return {
        getIndex,
        getBookDetail,
        addBooks,
        updateBook,
        getById,
        removeBook
    };
};

module.exports = bookController;
