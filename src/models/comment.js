import { model, Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Comment', CommentSchema);
