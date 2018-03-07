import User from '../../models/user-model';

module.exports = {
    findUserByUsername: async(username) => {
        return await User.findOne({ username: username });
    }
};

