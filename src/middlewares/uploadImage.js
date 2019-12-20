import uploader from '../controllers/uploadController';
import { forEachAsync } from '../utils';

function uploadImage(baseName, subName) {
  return async (req, res, next) => {
    const { body } = req;

    if (Array.isArray(body[baseName])) {
      const propertyName = subName || baseName;
      await forEachAsync(body[baseName], async (price, idx) => {
        if (price[propertyName]) {
          const { url } = await uploader.uploadProductImage(price[propertyName]);
          body[baseName][idx][propertyName] = url;
        }
      });
    } else if (body[baseName]) {
      const { url } = await uploader.uploadProductImage(body[baseName]);
      body[baseName] = url;
    }

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { uploadImage };
