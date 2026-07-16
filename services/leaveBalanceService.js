import Employee from "../models/employeeModel.js";
import LeaveBalance from "../models/leaveBalanceModel.js";

export const createLeaveBalanceService = async (data, userId) => {
  const existing = await LeaveBalance.findOne({
    employee: data.employee,
    leaveType: data.leaveType,
    year: data.year,
    isActive: true,
  });

  if (existing) {
    throw new Error(
      "Leave balance already exists for this employee, leave type and year.",
    );
  }

  return await LeaveBalance.create({
    ...data,
    createdBy: userId,
    updatedBy: userId,
  });
};

export const getLeaveBalancesService = async () => {
  return await LeaveBalance.find({
    isActive: true,
  })
    .populate("employee")
    .populate("leaveType");
};

export const updateLeaveBalanceService = async (id, data, userId) => {
  const leaveBalance = await LeaveBalance.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
    },
    {
      ...data,
      updatedBy: userId,
    },
    {
      new: true,
    },
  );

  if (!leaveBalance) {
    throw new Error("Leave balance not found.");
  }

  return leaveBalance;
};

export const deleteLeaveBalanceService = async (id, userId) => {
  const leaveBalance = await LeaveBalance.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
    },
    {
      isActive: false,
      updatedBy: userId,
    },
    {
      new: true,
    },
  );

  if (!leaveBalance) {
    throw new Error("Leave balance not found.");
  }

  return leaveBalance;
};

export const getMyLeaveBalancesService = async (userId, year) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const query = {
    employee: employee._id,
    isActive: true,
  };

  if (year) {
    query.year = Number(year);
  }

  const leaveBalances = await LeaveBalance.find(query)
    .populate("leaveType")
    .sort({
      year: -1,
      "leaveType.name": 1,
    });

  return leaveBalances.map((balance) => {
    const obj = balance.toObject();

    return {
      ...obj,
      remainingDays: Math.max(obj.allocatedDays - obj.usedDays, 0),
    };
  });
};
