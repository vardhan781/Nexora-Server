import mongoose from "mongoose";

const runningNumberSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    prefix: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    lastNumber: {
      type: Number,
      default: 0,
      min: 0,
    },

    numberLength: {
      type: Number,
      default: 6,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const RunningNumber = mongoose.model("RunningNumber", runningNumberSchema);

export default RunningNumber;
