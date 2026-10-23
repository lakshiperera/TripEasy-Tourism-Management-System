const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getDBMode } = require('../config/database');
const { EmbeddedAdmin } = require('../utils/embeddedStore');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const MongooseAdmin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

const Admin = new Proxy(MongooseAdmin, {
  get(target, prop) {
    if (getDBMode() === 'embedded' && EmbeddedAdmin[prop]) {
      return EmbeddedAdmin[prop];
    }
    return target[prop];
  },
});

module.exports = Admin;
