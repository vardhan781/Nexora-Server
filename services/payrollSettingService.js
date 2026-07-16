import PayrollSetting from "../models/payrollSettingModel.js";

export const createPayrollSettingService = async (data, userId) => {
  const existingSetting = await PayrollSetting.findOne({
    isActive: true,
  });

  if (existingSetting) {
    throw new Error("Payroll setting already exists.");
  }

  return await PayrollSetting.create({
    ...data,
    createdBy: userId,
    updatedBy: userId,
  });
};

export const getPayrollSettingService = async () => {
  return await PayrollSetting.findOne({
    isActive: true,
  });
};

export const updatePayrollSettingService = async (id, data, userId) => {
  const payrollSetting = await PayrollSetting.findOne({
    _id: id,
    isActive: true,
  });

  if (!payrollSetting) {
    throw new Error("Payroll setting not found.");
  }

  Object.assign(payrollSetting, {
    ...data,
    updatedBy: userId,
  });

  await payrollSetting.save();

  return payrollSetting;
};
