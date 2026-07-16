import mongoose from "mongoose";

const salaryStructureSchema = new mongoose.Schema(
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

const employeeSalarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    effectiveFrom: {
      type: Date,
      required: true,
    },

    grossSalary: {
      type: Number,
      required: true,
      default: 0,
    },

    ctc: {
      type: Number,
      required: true,
      default: 0,
    },

    salaryStructure: {
      type: [salaryStructureSchema],
      default: [],
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

const EmployeeSalary = mongoose.model("EmployeeSalary", employeeSalarySchema);

export default EmployeeSalary;
