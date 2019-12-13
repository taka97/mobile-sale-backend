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

    this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  async uploadAvatar(uri, options) {
    const result = await this.services.uploadAvatar(uri, options);
    return result;
  }
}

export default new UploadController();
