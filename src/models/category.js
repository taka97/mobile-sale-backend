import { model, Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

CategorySchema.index({ roles: 1, isDeleted: 1 }, { background: true });

export default model('Category', CategorySchema);
