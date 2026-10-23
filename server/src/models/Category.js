const mongoose = require('mongoose');
const { getDBMode } = require('../config/database');
const { EmbeddedCategory } = require('../utils/embeddedStore');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: '📍',
    },
    color: {
      type: String,
      default: '#355637',
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

const MongooseCategory = mongoose.models.Category || mongoose.model('Category', categorySchema);

const Category = new Proxy(MongooseCategory, {
  get(target, prop) {
    if (getDBMode() === 'embedded' && EmbeddedCategory[prop]) {
      return EmbeddedCategory[prop];
    }
    return target[prop];
  },
});

module.exports = Category;
