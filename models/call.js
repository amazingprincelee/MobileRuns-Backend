import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["initiated", "ringing", "ongoing", "ended", "missed", "rejected"],
      default: "initiated",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    callType: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },
  },
  { timestamps: true }
);

const Call = mongoose.model("Call", callSchema);
export default Call;