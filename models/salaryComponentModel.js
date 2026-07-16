import mongoose from "mongoose";

const salaryComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    componentType: {
      type: String,
      required: true,
      trim: true,
    },

    calculationType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
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

const SalaryComponent = mongoose.model(
  "SalaryComponent",
  salaryComponentSchema,
);

export default SalaryComponent;
