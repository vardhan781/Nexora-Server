import mongoose from "mongoose";

const payrollSettingSchema = new mongoose.Schema(
  {
    payrollClosingDay: {
      type: Number,
      required: true,
      default: 30,
    },

    salaryPayDay: {
      type: Number,
      required: true,
      default: 1,
    },

    pfEnabled: {
      type: Boolean,
      default: true,
    },

    esiEnabled: {
      type: Boolean,
      default: true,
    },

    professionalTaxEnabled: {
      type: Boolean,
      default: true,
    },

    incomeTaxEnabled: {
      type: Boolean,
      default: true,
    },

    payrollLocked: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
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

const PayrollSetting = mongoose.model("PayrollSetting", payrollSettingSchema);

export default PayrollSetting;
