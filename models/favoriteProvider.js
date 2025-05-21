import mongoose from "mongoose";

const favoriteProviderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType'
  }],
  // Track service history with this provider
  totalServicesUsed: {
    type: Number,
    default: 0
  },
  lastServiceDate: Date,
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },
  notes: String, // Client's private notes about the provider
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
favoriteProviderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure unique client-provider pairs
favoriteProviderSchema.index({ client: 1, provider: 1 }, { unique: true });

const FavoriteProvider = mongoose.model("FavoriteProvider", favoriteProviderSchema);

export default FavoriteProvider;