import { model, Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcryptjs';

const saltRounds = 10;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      // unique: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    username: {
      type: String,
      minlength: 5,
      maxlength: 50,
      // unique: true,
      index: true,
      trim: true,
    },
    fullname: {
      type: String, required: true, minlength: 5, maxlength: 128,
    },
    phone: {
      type: String, require: true, minlength: 10, maxlength: 12,
    },
    birthDate: {
      type: Date, required: true,
    },
    cmnd: {
      type: String,
    },
    address: {
      type: String,
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
    },
    roles: {
      type: String,
      enum: ['admin', 'staff', 'customer'],
      default: 'customer',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ roles: 1, isDeleted: 1 }, { background: true });

// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function (password) {
  return compareSync(password, this.password);
};

UserSchema.pre('updateMany', function (next) {
  this._update.password = hashSync(this._update.password, saltRounds);
  next();
});

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, saltRounds);
  next();
});

export default model('User', UserSchema);
