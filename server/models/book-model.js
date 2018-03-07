import mongoose from 'mongoose';

const bookModel = mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Book', bookModel);

