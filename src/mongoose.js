import debug from 'debug';
import config from 'config';
import mongoose from 'mongoose';

const dg = debug('DC:mongoose');

/* eslint-disable import/prefer-default-export */

export const init = () => {
  mongoose.connect(config.get('mongodb'), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on('error', (err) => dg('MongoDB connection error', err));
};
