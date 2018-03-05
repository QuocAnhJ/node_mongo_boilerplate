import passport from 'passport';
import localStrategy from './strategies/local.strategy';

module.exports = (app) => {
    app.use(passport.initialize());
    localStrategy();
};
