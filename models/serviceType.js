import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "waste_disposal",
      "home_tutor",
      "cleaner",
      "house_help",
      "barber",
      "drycleaner",
      "solar_installer",
      "cable_satellite_installer",
      "car_mechanic",
      "generator_mechanic",
      "carpenter",
      "electrician"
    ]
  },
  basePrice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Service specific parameters schema
  parameterSchema: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update timestamp on save
serviceTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

export default ServiceType;