import uploader from '../controllers/uploadController';
import { forEachAsync } from '../utils'

function uploadImage(baseName, subName) {
  return async (req, res, next) => {
    const { body } = req;

    await forEachAsync(body[baseName], async (price, idx) => {
      const { url } = await uploader.uploadProductImage(price.image);
      body[baseName][idx][subName] = url;
    });

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { uploadImage };
