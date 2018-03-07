import Book from '../models/book-model';
import { buildGetSuccessResponse, buildInternalServerErrorResponse, buildPostSuccessResponse, buildNotFoundErrorResponse, buildPutSuccessResponse, buildDeleteSuccessResponse } from '../helpers/http-response-helper';

const bookController = (bookService) => {
    const getIndex = async (req, res) => {
        try {
            const query = req.query;
            const result = await Book.find(query);

            return buildGetSuccessResponse(res, {
                books: result
            });
        } catch (err) {
            return buildInternalServerErrorResponse(res);
        }
    };

    const addBooks = async (req, res) => {
        try {
            const book = new Book(req.body);
            const newBook = await book.save();

            if (newBook) {
                return buildPostSuccessResponse(res, {
                    book: newBook
                });
            }
            return buildInternalServerErrorResponse(res);

        } catch (err) {
            return buildInternalServerErrorResponse(res);
        }
    };

    const getById = async (req, res, next) => {
        try {
            let result = await Book.findById(req.params.id);

            if (result) {
                req.book = result;
                return next();
            }
            return buildNotFoundErrorResponse(res, 'Book not found');
        } catch (err) {
            return buildInternalServerErrorResponse(res);
        }
    };

    const getBookDetail = async (req, res) => {
        try {
            const book = await bookService.getBookById(req.book._id);

            return buildGetSuccessResponse(res, {
                book
            });
        } catch (err) {
            return buildInternalServerErrorResponse(res);
        }
    };

    const updateBook = async (req, res) => {
        try {
            let book = new Book(req.book);

            book.title = req.body.title;
            book.author = req.body.author;
            book.read = req.body.read;
            book.genre = req.body.genre;
            const updatedBook = await book.save();

            if (updatedBook) {
                return buildPutSuccessResponse(res, {
                    book: updatedBook
                });
            }
            return buildInternalServerErrorResponse(res);
        } catch (err) {
            return buildInternalServerErrorResponse(res);
        }
    };

    const removeBook = async (req, res) => {
        try {
            let book = req.book;
            const removedBook = await book.remove();

            if (removedBook) {
                return buildDeleteSuccessResponse(res);
            }
            return buildInternalServerErrorResponse(res);
        } catch (err) {
            return buildInternalServerErrorResponse(res);
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
