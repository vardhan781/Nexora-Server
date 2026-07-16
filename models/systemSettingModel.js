import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    companyCode: {
      type: String,
      required: true,
    },

    companyEmail: {
      type: String,
      default: "",
    },

    companyPhone: {
      type: String,
      default: "",
    },

    companyWebsite: {
      type: String,
      default: "",
    },

    companyAddress: {
      type: String,
      default: "",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    dateFormat: {
      type: String,
      default: "DD/MM/YYYY",
    },

    currency: {
      type: String,
      default: "INR",
    },

    logoUrl: {
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

export default mongoose.model("SystemSetting", systemSettingSchema);
