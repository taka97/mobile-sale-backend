import { model, Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [{
      type: Object,
    }],
    currency: {
      type: String,
      default: 'VND',
    },
    email: {
      type: String,
    },
    shippingAddress: {
      fullname: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      company: {
        type: String,
      },
    },
    billingAddress: {
      fullname: {
        type: String
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      company: {
        type: String,
      }
    },
    shippingMethod: {
      type: String,
    },
    shippingTax: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentMethod: {
      type: String,
    },
    totalQty: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalItemsPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalTax: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Order', OrderSchema);
