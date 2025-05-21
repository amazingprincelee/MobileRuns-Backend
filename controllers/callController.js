import Call from "../models/call.js";

// Initialize a new call
export const initiateCall = async (req, res) => {
  try {
    const { receiverId, jobId, callType } = req.body;
    const callerId = req.user._id;

    const call = await Call.create({
      caller: callerId,
      receiver: receiverId,
      jobId,
      callType,
      status: "initiated",
    });

    res.status(201).json({
      success: true,
      call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update call status
export const updateCallStatus = async (req, res) => {
  try {
    const { callId } = req.params;
    const { status } = req.body;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    if (status === "ongoing" && !call.startTime) {
      call.startTime = new Date();
    } else if (["ended", "missed", "rejected"].includes(status) && !call.endTime) {
      call.endTime = new Date();
    }

    call.status = status;
    await call.save();

    res.status(200).json({
      success: true,
      call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get call history for a user
export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const calls = await Call.find({
      $or: [{ caller: userId }, { receiver: userId }],
    })
      .populate("caller", "name")
      .populate("receiver", "name")
      .populate("jobId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      calls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};