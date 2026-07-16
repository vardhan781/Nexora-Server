import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    followUpDate: {
      type: Date,
      required: true,
    },

    remarks: {
      type: String,
      required: true,
      trim: true,
    },

    nextFollowUpDate: {
      type: Date,
      default: null,
    },

    createdByEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
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

const FollowUp = mongoose.model("FollowUp", followUpSchema);

export default FollowUp;
