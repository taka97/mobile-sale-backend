import createService from '../services/Images';

class UploadController {
  constructor() {
    const options = {
      folder: {
        avatar: 'avatars',
        image: 'asserts',
      },
    };

    this.services = createService(options);

    this.upload = this.upload.bind(this);
  }

  async upload(req, res, next) {
    const { uri } = req.body;

    try {
      const uploadOption = {

      };
      const result = await this.services.upload(uri, uploadOption);
      return res.send(result);
    } catch (error) {
      return next(err);
    }
  }

  async uploadAvatar(uri, options) {
    try {
      const result = await this.services.uploadAvatar(uri, options);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new UploadController();
