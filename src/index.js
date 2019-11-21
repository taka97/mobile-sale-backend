import debug from 'debug';
import config from 'config';
import app from './app';

const dg = debug('MS:main');
const port = process.env.PORT || config.get('port');

(async () => {
  await app.listen(port);
  dg(`Server is listening on port ${port}`);
})();
