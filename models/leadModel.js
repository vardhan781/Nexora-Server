import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    leadCode: {
      type: String,
      required: true,
    },

    leadName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    mobileNumber: {
      type: String,
      default: "",
    },

    leadStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadStatus",
      required: true,
    },

    leadSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSource",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    convertedClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },

    remarks: {
      type: String,
      default: "",
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

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
