import { compareSync, hashSync } from 'bcryptjs';
import { model, Schema } from 'mongoose';

const saltRounds = 10;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    name: {
      type: String, required: true, minlength: 5, maxlength: 50,
    },
    phone: {
      type: String, require: true, minlength: 10, maxlength: 12,
    },
  },
  {
    timestamps: true,
  },
);

// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function (password) {
  return compareSync(password, this.password);
};

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, saltRounds);
  next();
});

export default model('User', UserSchema);
