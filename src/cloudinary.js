import config from 'config';
import cloudinary from 'cloudinary';

const init = () => {
  cloudinary.v2.config(config.cloudinary);
};

export default init;
