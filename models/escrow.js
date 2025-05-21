import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
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
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'held', 'released', 'refunded', 'disputed'],
    default: 'pending'
  },
  // Payment release request
  releaseRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    requestedAt: Date,
    approvedAt: Date,
    proof: String
  },
  // Refund request
  refundRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    requestedAt: Date,
    approvedAt: Date,
    reason: String,
    providerApproval: {
      type: Boolean,
      default: false
    }
  },
  // Dispute details if status is 'disputed'
  dispute: {
    reason: String,
    clientEvidence: String,
    providerEvidence: String,
    resolution: String,
    resolvedAt: Date
  },
  // Transaction tracking
  transactionId: String,
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
escrowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure unique service-based escrow
escrowSchema.index({ service: 1 }, { unique: true });

const Escrow = mongoose.model("Escrow", escrowSchema);

export default Escrow;