import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import chalk from 'chalk';
import dotenv from 'dotenv';
import logger from 'morgan';
import expressValidator from 'express-validator';
import expressStatusMonitor from 'express-status-monitor';
import passport from 'passport';
import { verifyToken } from './server/helpers/jwt-helper';
import router from './server/routes';
import { responseHandler } from './server/helpers/http-response-handler';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: 'config.env' });
const port = process.env.PORT || 5000;

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGOLAB_URI).then(
  () => {
      console.log(chalk.green('MongoDB connection is established'));
  },
  err => {
      console.error(err);
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
      process.exit();
   }
);

/**
 * Express configuration.
 */
app.use(expressStatusMonitor());
app.use(logger('dev'));
app.use(bodyParser.json(), );
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(expressValidator());
/**
 * Passport configuration.
 */
require('./server/config/passport')(app);

/**
 * Protect authorized routes.
 */


app.use(verifyToken);

/**
 * Primary app routes.
 */
app.use('/api', router);

app.use(responseHandler);
/**
 * Start Express server.
 */
app.listen(port, function (err) {
    console.log(chalk.green('Running server on port ' + port));
});
