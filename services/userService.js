import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import Employee from "../models/employeeModel.js";

export const createUserService = async (userData) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    role,
    employee = null,
  } = userData;

  const roleExists = await Role.findById(role);

  if (!roleExists) {
    throw new Error("Role not found");
  }

  if (employee) {
    const employeeExists = await Employee.findById(employee);

    if (!employeeExists) {
      throw new Error("Employee not found");
    }

    if (employeeExists.user) {
      throw new Error("User already exists for this employee");
    }
  }

  const usernameExists = await User.findOne({
    username: username.toLowerCase(),
    isActive: true,
  });

  if (usernameExists) {
    throw new Error("Username already exists");
  }

  const emailExists = await User.findOne({
    email: email.toLowerCase(),
    isActive: true,
  });

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    employee,
  });

  if (employee) {
    await Employee.findByIdAndUpdate(employee, {
      user: user._id,
    });
  }

  return await User.findById(user._id)
    .populate("role", "roleName roleCode")
    .populate("employee", "employeeCode firstName lastName");
};

export const getUsersService = async () => {
  return await User.find({ isActive: true })
    .populate("role", "roleName roleCode")
    .populate("employee", "employeeCode firstName lastName")
    .sort({ createdAt: -1 });
};

export const updateUserService = async (userId, updateData) => {
  const { firstName, lastName, username, email, role, employee, isActive } =
    updateData;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.employee && user.employee.toString() !== employee) {
    await Employee.findByIdAndUpdate(user.employee, {
      user: null,
    });
  }

  const roleExists = await Role.findById(role);

  if (!roleExists) {
    throw new Error("Role not found");
  }

  const usernameExists = await User.findOne({
    username: username.toLowerCase(),
    _id: { $ne: userId },
    isActive: true,
  });

  if (usernameExists) {
    throw new Error("Username already exists");
  }

  const emailExists = await User.findOne({
    email: email.toLowerCase(),
    _id: { $ne: userId },
    isActive: true,
  });

  if (emailExists) {
    throw new Error("Email already exists");
  }

  if (employee) {
    const employeeExists = await Employee.findById(employee);

    if (!employeeExists) {
      throw new Error("Employee not found");
    }

    if (employeeExists.user && employeeExists.user.toString() !== userId) {
      throw new Error("Employee already linked to another user");
    }

    await Employee.findByIdAndUpdate(employee, {
      user: userId,
    });
  }

  return await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      role,
      employee,
      isActive,
    },
    {
      returnDocument: true,
      runValidators: true,
    },
  )
    .populate("role", "roleName roleCode")
    .populate("employee", "employeeCode firstName lastName");
};

export const deleteUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.employee) {
    await Employee.findByIdAndUpdate(user.employee, {
      user: null,
    });
  }

  return await User.findByIdAndUpdate(
    userId,
    {
      isActive: false,
    },
    {
      returnDocument: true,
    },
  );
};
