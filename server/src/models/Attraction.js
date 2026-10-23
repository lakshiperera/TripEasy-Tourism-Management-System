const mongoose = require('mongoose');
const { getDBMode } = require('../config/database');
const { EmbeddedAttraction } = require('../utils/embeddedStore');

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Attraction name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    images: [
      {
        filename: String,
        url: String,
        caption: String,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
      },
      address: String,
    },
    openingHours: {
      weekdays: String,
      weekends: String,
      notes: String,
      isClosed: {
        type: Boolean,
        default: false,
      },
    },
    entranceFee: {
      localAdult: { type: Number, default: 0 },
      localChild: { type: Number, default: 0 },
      foreignAdult: { type: Number, default: 0 },
      foreignChild: { type: Number, default: 0 },
      isFree: { type: Boolean, default: true },
    },
    travelInfo: {
      distanceFromRagama: Number, // in km
      estimatedTravelTime: Number, // in minutes by vehicle
      estimatedVisitDuration: { type: Number, default: 45 }, // in minutes
    },
    travelTips: [String],
    facilities: [String],
    contactInfo: {
      phone: String,
      website: String,
      email: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

attractionSchema.index({ location: '2dsphere' });

attractionSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

const MongooseAttraction = mongoose.models.Attraction || mongoose.model('Attraction', attractionSchema);

const Attraction = new Proxy(MongooseAttraction, {
  get(target, prop) {
    if (getDBMode() === 'embedded' && EmbeddedAttraction[prop]) {
      return EmbeddedAttraction[prop];
    }
    return target[prop];
  },
});

module.exports = Attraction;
