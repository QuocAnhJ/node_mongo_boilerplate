const goodreadsService = () => {
    const getBookById = async (id) => {
        return {
            description: `${id} Our description`
        };
    };

    return {
        getBookById
    };
};

module.exports = goodreadsService;
