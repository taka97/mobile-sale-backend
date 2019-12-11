import createError from 'http-errors';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import compression from 'compression';
import { urlencoded, json } from 'body-parser';
import { serve, setup } from 'swagger-ui-express';

import swaggerSpecs from './services/swagger-specs';
import configDB from './mongoose';
import configCloudinary from './cloudinary';
import passport from './authentication';
import apiRouter from './routes';

const app = express();

configDB();
configCloudinary();

app.use(helmet());
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json({ limit: '1mb' }));
app.use(passport.initialize());
app.use(compression());

// api docs
app.use('/api-docs', serve, setup(swaggerSpecs));
app.use('/api', apiRouter);

// error handling
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});

export default app;
