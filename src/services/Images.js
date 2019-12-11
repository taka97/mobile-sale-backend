import { InternalServerError } from 'http-errors';
import { v2 as cloudinary } from 'cloudinary';

class Images {
  constructor(options) {
    this.options = options || {};
    this.folder = options.folder || {};
  }

  upload(uri, uploadOption) {
    return cloudinary.uploader
      .upload(uri, uploadOption)
      .then((uploadResult) => ({
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        url: uploadResult.secure_url,
        created_at: uploadResult.created_at,
        bytes: uploadResult.bytes,
      }))
      .catch((err) => Promise.reject(new InternalServerError(err)));
  }

  uploadAvatar(uri, uploadOption) {
    return this.upload(uri, {
      ...uploadOption,
      folder: this.folder.avatar || 'avatar',
    });
  }
}

function init(options) {
  return new Images(options);
}

export default init;
export { Images };
