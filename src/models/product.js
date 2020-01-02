import { model, Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      index: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    details: [{
      name: { type: String, required: true },
      value: { type: String, required: true },
    }],
    price: {
      type: Number, required: true,
    },
    options: [{
      group: { type: String, required: true },
      name: { type: String, required: true },
      value: { type: String, required: true },
    }],
    images: [{
      type: String, required: true,
    }],
    review: {
      type: String,
    },
    shortReview: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'out of stock'],
      default: 'available',
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

export default model('Product', ProductSchema);
