import { model, Schema } from 'mongoose';

const CheckoutSchema = new Schema(
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
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

CheckoutSchema.index({ 'updatedAt': 1 }, { expires: '5m' });

// eslint-disable-next-line func-names
CheckoutSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.shippingTax) {
    update.totalTax = update.shippingTax;
  }

  next();
});

// eslint-disable-next-line func-names
CheckoutSchema.pre('save', function (next) {
  this.totalPrice = this.totalItemsPrice + this.totalTax;
  next();
});

export default model('Checkout', CheckoutSchema);
