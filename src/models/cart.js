import { model, Schema } from 'mongoose';

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [{
      _id: false,
      item: {
        type: Object,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      priceId: {
        type: Schema.Types.ObjectId,
      },
      price: {
        type: Number,
        min: 0,
      },
      qty: {
        type: Number,
        default: 1,
      },
    }],
    totalQty: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Cart', CartSchema);
