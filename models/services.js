import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  // Service type and pricing
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType',
    required: true
  },
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
  // Dynamic pricing factors
  distanceMultiplier: {
    type: Number,
    default: 1.0 // Increases based on distance between provider and client
  },
  // Service specific parameters
  serviceParams: {
    // Waste Disposal
    wasteBagCount: Number, // Price per bag: 1000 naira
    
    // Home Tutor
    studentCount: Number, // Base price per student: 20,000 naira/month
    daysPerWeek: {
      type: Number,
      enum: [2, 3] // Only 2 or 3 days per week options
    },
    
    // Barber
    clientType: {
      type: String,
      enum: ["adult_male", "adult_female", "child_male", "child_female"]
    },
    clientCount: Number, // Number of people to serve

    // Drycleaner
    items: [{
      type: {
        type: String,
        enum: ["shirt", "suit", "dress", "pants", "jacket", "bedding", "other"]
      },
      quantity: Number
    }],

    // Solar Installer
    systemSize: Number, // in kW
    equipmentType: {
      type: String,
      enum: ["basic", "premium", "luxury"]
    },

    // Cable/Satellite Installer
    packageType: {
      type: String,
      enum: ["basic", "standard", "premium"]
    },
    numberOfPoints: Number,

    // Car/Generator Mechanic
    serviceType: {
      type: String,
      enum: ["diagnosis", "repair", "maintenance"]
    },
    complexityLevel: {
      type: String,
      enum: ["low", "medium", "high"]
    },

    // Carpenter/Electrician
    projectType: {
      type: String,
      enum: ["installation", "repair", "custom"]
    },
    projectSize: {
      type: String,
      enum: ["small", "medium", "large"]
    },
    materialQuality: {
      type: String,
      enum: ["standard", "premium"]
    }
  },
  // Service request details
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'awarded', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  // Payment tracking
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'in_escrow', 'completed', 'refunded'],
    default: 'pending'
  },
  // Rating and feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  providerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  providerFeedback: String,
  // Dispute handling
  dispute: {
    status: {
      type: String,
      enum: ['none', 'opened', 'resolved'],
      default: 'none'
    },
    clientProof: String,
    providerProof: String,
    resolution: String
  },
  // Communication channels
  chatEnabled: {
    type: Boolean,
    default: false
  },
  callEnabled: {
    type: Boolean,
    default: false
  },
  // Service completion
  completedAt: Date,
  completionProof: String,
  clientApproval: {
    type: Boolean,
    default: false
  }  
},
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [Number] // [longitude, latitude]
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
serviceSchema.index({ location: "2dsphere" });

// Method to calculate final price based on service type and parameters
serviceSchema.methods.calculatePrice = function(distance, params) {
  let finalPrice = this.basePrice;

  // Apply distance multiplier (increases by 10% for every 5km)
  const distanceMultiplier = 1 + (Math.floor(distance / 5) * 0.1);
  finalPrice *= distanceMultiplier;

  switch (this.name) {
    case "waste_disposal":
      finalPrice *= (params.wasteBagCount || 1); // 1000 naira per bag
      break;

    case "home_tutor":
      finalPrice *= (params.studentCount || 1);
      finalPrice *= (params.daysPerWeek === 2 ? 0.8 : 1); // 20% discount for 2 days/week
      break;

    case "barber":
      finalPrice *= (params.clientCount || 1);
      // Apply multiplier based on client type
      if (params.clientType?.includes("child")) {
        finalPrice *= 0.8; // 20% discount for children
      }
      break;

    case "drycleaner":
      if (params.items && params.items.length > 0) {
        const itemPrices = {
          shirt: 1000,
          suit: 3000,
          dress: 2500,
          pants: 1500,
          jacket: 2000,
          bedding: 4000
        };
        const totalPrice = params.items.reduce((sum, item) => {
          return sum + (itemPrices[item.type] * (item.quantity || 1));
        }, 0);
        finalPrice = totalPrice;
      }
      break;

    case "solar_installer":
      const basePricePerKW = 20000; // 100,000 naira per kW
      finalPrice = basePricePerKW * (params.systemSize || 1);
      const equipmentMultiplier = {
        basic: 1,
        premium: 1.3,
        luxury: 1.6
      };
      finalPrice *= equipmentMultiplier[params.equipmentType] || 1;
      break;

    case "cable_satellite_installer":
      const packagePrices = {
        basic: 5000,
        standard: 25000,
        premium: 35000
      };
      finalPrice = packagePrices[params.packageType] || packagePrices.basic;
      finalPrice += (params.numberOfPoints || 1) * 5000; // 5,000 per additional point
      break;

    case "car_mechanic":
    case "generator_mechanic":
      const diagnosisFee = 5000;
      const complexityMultiplier = {
        low: 1,
        medium: 1.5,
        high: 2
      };
      if (params.serviceType === "diagnosis") {
        finalPrice = diagnosisFee;
      } else {
        finalPrice *= complexityMultiplier[params.complexityLevel] || 1;
      }
      break;

    case "carpenter":
    case "electrician":
      const projectSizeMultiplier = {
        small: 1,
        medium: 2,
        large: 3
      };
      const materialMultiplier = {
        standard: 1,
        premium: 1.5
      };
      finalPrice *= projectSizeMultiplier[params.projectSize] || 1;
      finalPrice *= materialMultiplier[params.materialQuality] || 1;
      if (params.projectType === "custom") {
        finalPrice *= 1.2; // 20% premium for custom work
      }
      break;

    // Add more service-specific calculations here
  }

  return Math.round(finalPrice); // Round to nearest naira
};

const Service = mongoose.model("Service", serviceSchema);

export default Service;