import passportLocal from 'passport-local';
import passport from 'passport';
import User from '../../models/user-model';

const LocalStrategy = passportLocal.Strategy;

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });

            if (!user) {
                done(null, false);
            }
            const isMatch = await user.isValidPassword(password);

            if (!isMatch) {
                return done(null, false);
            }
            done(null, user);
        } catch (err) {
            done(null, false);
        }
    }
  ));
};
