import mongoose from "mongoose";

const providerServiceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Work history tracking
  totalJobsCompleted: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  // Provider's custom pricing adjustments
  priceMultiplier: {
    type: Number,
    default: 1.0,
    min: 0.8, // Allow up to 20% discount
    max: 1.5  // Allow up to 50% premium
  },
  // Provider's availability settings
  availability: {
    type: Boolean,
    default: true
  },
  // Service area
  serviceArea: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [Number], // [longitude, latitude]
    radius: {
      type: Number,
      default: 10000 // Service radius in meters
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure provider can only have 3 active services
providerServiceSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('isActive')) {
    const activeServices = await this.constructor.countDocuments({
      provider: this.provider,
      isActive: true,
      _id: { $ne: this._id }
    });
    
    if (activeServices >= 3 && this.isActive) {
      throw new Error('Provider can only have up to 3 active services');
    }
  }
  this.updatedAt = Date.now();
  next();
});

// Index for geospatial queries
providerServiceSchema.index({ serviceArea: "2dsphere" });
// Compound index for efficient provider service lookups
providerServiceSchema.index({ provider: 1, serviceType: 1 }, { unique: true });

const ProviderService = mongoose.model("ProviderService", providerServiceSchema);

export default ProviderService;