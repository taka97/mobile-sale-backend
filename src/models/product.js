import { model, Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      // unique: true,
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
    prices: [{
      image: { type: String, required: true },
      color: { type: String, required: true },
      memory: { type: String, required: true },
      warranty: { type: String, required: true },
      price: { type: Number, required: true },
      currentQty: { type: Number, required: true, default: 0 },
      totalQty: { type: Number, required: true, default: 0 },
    }],
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
