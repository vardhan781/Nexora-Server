import mongoose from "mongoose";

const payrollComponentSchema = new mongoose.Schema(
  {
    salaryComponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryComponent",
      required: true,
    },

    value: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    payrollMonth: {
      type: Number,
      required: true,
    },

    payrollYear: {
      type: Number,
      required: true,
    },

    workingDays: {
      type: Number,
      default: 0,
    },

    payableDays: {
      type: Number,
      default: 0,
    },

    presentDays: {
      type: Number,
      default: 0,
    },

    leaveDays: {
      type: Number,
      default: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
    },

    grossSalary: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    totalDeductions: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      default: 0,
    },

    salaryStructure: {
      type: [payrollComponentSchema],
      default: [],
    },

    generatedAt: {
      type: Date,
      default: Date.now,
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

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
