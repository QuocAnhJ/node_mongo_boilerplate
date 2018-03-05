import Book from '../models/bookModel';
import { RESPONSE_STATUS } from '../config';
import {  buildGetSuccessResponse ,
          buildInternalServerErrorResponse,
          buildPostSuccessResponse,
          buildValidationErrorResponse,
          buildNotFoundErrorResponse,
          buildPutSuccessResponse,
          buildDeleteSuccessResponse
        } from '../helpers/httpResponseHelper';

const bookController = (bookService) => {
    const getIndex = async (req, res) => {
        try {
            const query = req.query;
            const result = await Book.find(query);

            buildGetSuccessResponse(res, {
                books: result
            });
        } catch (err) {
            buildInternalServerErrorResponse(res);
        }
    };

    const addBooks = async (req, res) => {
        try {
            /* Field validation */
            req.checkBody('title', 'Title cannot be blank').notEmpty().trim();
            req.checkBody('author', 'Author cannot be blank').notEmpty().trim();
            req.checkBody('genre').trim();
            req.checkBody('read', 'Read is must boolean type').isBoolean().trim();

            const errors = req.validationErrors();

            if (errors) {
                return buildValidationErrorResponse(res, errors);
            }
            /* End of field Validation */

            const book = new Book(req.body);
            const newBook = await book.save();

            if (newBook) {
                return buildPostSuccessResponse(res, {
                    book: newBook
                 });
            } else {
                buildInternalServerErrorResponse(res);
            }

        } catch (err) {
            buildInternalServerErrorResponse(res);
        }
    };

    const getById = async (req, res, next) => {
        try {
            let result = await Book.findById(req.params.id);

            if (result) {
                req.book = result;
                next();
            } else {
                return buildNotFoundErrorResponse(res, 'Book not found');
            }
        } catch (err) {
            buildInternalServerErrorResponse(res);
        }
    };

    const getBookDetail = async (req, res) => {
        try {
            const book = await bookService.getBookById(req.book._id);

            return buildGetSuccessResponse(res, {
                book
            });
        } catch (err) {
            buildInternalServerErrorResponse(res);
        }
    };

    const updateBook = async (req, res) => {
        try {
            /* Field validation */
            req.checkBody('title', 'Title cannot be blank').notEmpty().trim();
            req.checkBody('author', 'Author cannot be blank').notEmpty().trim();
            req.checkBody('genre').trim();
            req.checkBody('read', 'Read is must boolean type').isBoolean().trim();

            const errors = req.validationErrors();

            if (errors) {
                return buildValidationErrorResponse(res, errors);
            }
            /* End of field Validation */

            let book = new Book(req.book);

            book.title = req.body.title;
            book.author = req.body.author;
            book.read = req.body.read;
            book.genre = req.body.genre;
            console.log('aaa');
            const updatedBook = await book.save();

            console.log('bbb');
            console.log(updatedBook);
            if (updatedBook) {
                return buildPutSuccessResponse(res, {
                    book: updatedBook
                });
            } else {
                buildInternalServerErrorResponse(res);
            }
        } catch (err) {
            buildInternalServerErrorResponse(res);
        }
    };

    const removeBook = async (req, res) => {
        try {
            let book = req.book;
            const removedBook = await book.remove();

            if (removedBook) {
                return buildDeleteSuccessResponse(res);
            } else {
              buildInternalServerErrorResponse(res);
            }
        } catch (err) {
            buildInternalServerErrorResponse(res);
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
