import Employee from "../models/employeeModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const validateDuplicateFields = async (
  { employeeCode, personalEmail, officialEmail, mobileNumber, user },
  excludeId = null,
) => {
  const filter = excludeId
    ? { _id: { $ne: excludeId }, isActive: true }
    : { isActive: true };

  if (employeeCode) {
    const existingEmployeeCode = await Employee.findOne({
      employeeCode,
      ...filter,
    });

    if (existingEmployeeCode) {
      throw new Error("Employee code already exists");
    }
  }

  if (personalEmail) {
    const existingPersonalEmail = await Employee.findOne({
      personalEmail,
      ...filter,
    });

    if (existingPersonalEmail) {
      throw new Error("Personal email already exists");
    }
  }

  if (officialEmail) {
    const existingOfficialEmail = await Employee.findOne({
      officialEmail,
      ...filter,
    });

    if (existingOfficialEmail) {
      throw new Error("Official email already exists");
    }
  }

  if (mobileNumber) {
    const existingMobileNumber = await Employee.findOne({
      mobileNumber,
      ...filter,
    });

    if (existingMobileNumber) {
      throw new Error("Mobile number already exists");
    }
  }

  if (user) {
    const existingUser = await Employee.findOne({
      user,
      ...filter,
    });

    if (existingUser) {
      throw new Error("User is already assigned to another employee");
    }
  }
};

export const createEmployee = async (data, file, userId) => {
  await validateDuplicateFields(data);

  let profileImage = "";

  if (file) {
    const uploadedImage = await uploadToCloudinary(file.buffer, "employees");

    profileImage = uploadedImage.secure_url;
  }

  const employee = await Employee.create({
    ...data,
    profileImage,
    createdBy: userId,
  });

  return employee;
};

export const getEmployees = async () => {
  const employees = await Employee.find({
    isActive: true,
  })
    .populate("department", "name code")
    .populate("designation", "name code")
    .populate("employeeType", "name code")
    .populate("employeeStatus", "name code")
    .populate("reportingManager", "employeeCode firstName lastName")
    .populate("user", "username")
    .populate("shift", "name startTime endTime")
    .sort({
      createdAt: -1,
    });

  return employees;
};

export const updateEmployee = async (id, data, file, userId) => {
  const employee = await Employee.findById(id);

  if (!employee || !employee.isActive) {
    throw new Error("Employee not found");
  }

  await validateDuplicateFields(data, id);

  if (data.emergencyContact && typeof data.emergencyContact === "string") {
    data.emergencyContact = JSON.parse(data.emergencyContact);
  }

  if (data.address && typeof data.address === "string") {
    data.address = JSON.parse(data.address);
  }

  if (file) {
    const uploadedImage = await uploadToCloudinary(file.buffer, "employees");

    employee.profileImage = uploadedImage.secure_url;
  }

  delete data.employeeCode;
  delete data.createdBy;
  delete data.createdAt;

  Object.assign(employee, data);

  employee.updatedBy = userId;

  await employee.save();

  return employee;
};

export const deleteEmployee = async (id, userId) => {
  const employee = await Employee.findById(id);

  if (!employee || !employee.isActive) {
    throw new Error("Employee not found");
  }

  employee.isActive = false;
  employee.updatedBy = userId;

  await employee.save();

  return employee;
};
