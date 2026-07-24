import Payroll from "../models/payrollModel.js";
import Employee from "../models/employeeModel.js";
import EmployeeSalary from "../models/employeeSalaryModel.js";
import Attendance from "../models/attendanceModel.js";
import AttendanceStatus from "../models/attendanceStatusModel.js";
import SalaryComponent from "../models/salaryComponentModel.js";
import Holiday from "../models/holidayModel.js";
import {
  getMonthEnd,
  getMonthStart,
  getWeekdayCode,
} from "../utils/dateUtils.js";

const getMonthDateRange = (month, year) => ({
  startDate: getMonthStart(month, year),
  endDate: getMonthEnd(month, year),
});

const calculateAttendanceSummary = async (
  employee,
  payrollMonth,
  payrollYear,
) => {
  const { startDate, endDate } = getMonthDateRange(payrollMonth, payrollYear);

  const attendanceStatuses = await AttendanceStatus.find({
    isActive: true,
  });

  const statusMap = attendanceStatuses.reduce((acc, status) => {
    acc[status.code] = status._id.toString();
    return acc;
  }, {});

  const attendances = await Attendance.find({
    employee: employee._id,
    attendanceDate: {
      $gte: startDate,
      $lte: endDate,
    },
    isActive: true,
  });

  let presentDays = 0;
  let leaveDays = 0;

  attendances.forEach((attendance) => {
    const statusId = attendance.attendanceStatus.toString();

    if (statusId === statusMap.PRESENT) {
      presentDays += 1;
    } else if (statusId === statusMap.LEAVE) {
      leaveDays += 1;
    } else if (statusId === statusMap.HALF_DAY) {
      presentDays += 0.5;
      leaveDays += 0.5;
    }
  });

  const holidays = await Holiday.countDocuments({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    isActive: true,
  });

  let weeklyOffs = 0;

  if (employee.shift?.weeklyOffDays?.length) {
    const weeklyOffDays = employee.shift.weeklyOffDays;

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dayName = getWeekdayCode(currentDate);

      if (weeklyOffDays.includes(dayName)) {
        weeklyOffs++;
      }
    }
  }

  const totalDays = endDate.getDate();

  const workingDays = Math.max(totalDays - weeklyOffs - holidays, 0);

  const absentDays = Math.max(workingDays - presentDays - leaveDays, 0);

  const payableDays = presentDays + leaveDays;

  return {
    workingDays,
    payableDays,
    presentDays,
    leaveDays,
    absentDays,
  };
};

const calculateSalaryStructure = async (
  employeeSalary,
  payableDays,
  workingDays,
) => {
  const proratedGrossSalary =
    workingDays > 0
      ? (employeeSalary.grossSalary / workingDays) * payableDays
      : 0;

  let totalEarnings = 0;
  let totalDeductions = 0;

  const salaryStructure = [];

  for (const structure of employeeSalary.salaryStructure) {
    const component = await SalaryComponent.findOne({
      _id: structure.salaryComponent,
      isActive: true,
    });

    if (!component) {
      continue;
    }

    let calculatedValue = 0;

    if (component.calculationType === "Fixed") {
      calculatedValue =
        workingDays > 0 ? (structure.value / workingDays) * payableDays : 0;
    } else if (component.calculationType === "Percentage") {
      calculatedValue = (proratedGrossSalary * structure.value) / 100;
    }

    calculatedValue = Number(calculatedValue.toFixed(2));

    salaryStructure.push({
      salaryComponent: component._id,
      value: calculatedValue,
    });

    if (component.componentType === "Earning") {
      totalEarnings += calculatedValue;
    } else if (component.componentType === "Deduction") {
      totalDeductions += calculatedValue;
    }
  }

  totalEarnings = Number(totalEarnings.toFixed(2));
  totalDeductions = Number(totalDeductions.toFixed(2));

  return {
    grossSalary: Number(proratedGrossSalary.toFixed(2)),
    totalEarnings,
    totalDeductions,
    netSalary: Number((totalEarnings - totalDeductions).toFixed(2)),
    salaryStructure,
  };
};

export const generatePayrollService = async (
  employeeId,
  payrollMonth,
  payrollYear,
  userId,
) => {
  const existingPayroll = await Payroll.findOne({
    employee: employeeId,
    payrollMonth,
    payrollYear,
    isActive: true,
  });

  if (existingPayroll) {
    throw new Error("Payroll has already been generated for this month.");
  }

  const employee = await Employee.findOne({
    _id: employeeId,
    isActive: true,
  }).populate("shift");

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const { endDate } = getMonthDateRange(payrollMonth, payrollYear);

  const employeeSalary = await EmployeeSalary.findOne({
    employee: employee._id,
    effectiveFrom: {
      $lte: endDate,
    },
    isActive: true,
  })
    .sort({
      effectiveFrom: -1,
    })
    .populate("salaryStructure.salaryComponent");

  if (!employeeSalary) {
    throw new Error("Salary structure not found for this employee.");
  }

  const attendanceSummary = await calculateAttendanceSummary(
    employee,
    payrollMonth,
    payrollYear,
  );

  const salarySummary = await calculateSalaryStructure(
    employeeSalary,
    attendanceSummary.payableDays,
    attendanceSummary.workingDays,
  );

  const payroll = await Payroll.create({
    employee: employee._id,

    payrollMonth,
    payrollYear,

    workingDays: attendanceSummary.workingDays,
    payableDays: attendanceSummary.payableDays,
    presentDays: attendanceSummary.presentDays,
    leaveDays: attendanceSummary.leaveDays,
    absentDays: attendanceSummary.absentDays,

    grossSalary: salarySummary.grossSalary,
    totalEarnings: salarySummary.totalEarnings,
    totalDeductions: salarySummary.totalDeductions,
    netSalary: salarySummary.netSalary,

    salaryStructure: salarySummary.salaryStructure,

    createdBy: userId,
    updatedBy: userId,
  });

  return await Payroll.findById(payroll._id)
    .populate("employee")
    .populate("salaryStructure.salaryComponent");
};

export const getPayrollService = async (filters) => {
  const query = {
    isActive: true,
  };

  if (filters.payrollMonth) {
    query.payrollMonth = Number(filters.payrollMonth);
  }

  if (filters.payrollYear) {
    query.payrollYear = Number(filters.payrollYear);
  }

  if (filters.employee) {
    query.employee = filters.employee;
  }

  let payrolls = await Payroll.find(query)
    .populate({
      path: "employee",
      populate: [
        {
          path: "department",
        },
        {
          path: "designation",
        },
      ],
    })
    .populate("salaryStructure.salaryComponent")
    .sort({
      payrollYear: -1,
      payrollMonth: -1,
      createdAt: -1,
    });

  if (filters.department) {
    payrolls = payrolls.filter(
      (payroll) =>
        payroll.employee?.department?._id.toString() === filters.department,
    );
  }

  return payrolls;
};

export const getPayrollByIdService = async (id) => {
  const payroll = await Payroll.findOne({
    _id: id,
    isActive: true,
  })
    .populate({
      path: "employee",
      populate: [
        {
          path: "department",
        },
        {
          path: "designation",
        },
        {
          path: "employeeType",
        },
        {
          path: "employeeStatus",
        },
        {
          path: "reportingManager",
          select: "firstName middleName lastName employeeCode",
        },
        {
          path: "shift",
        },
      ],
    })
    .populate("salaryStructure.salaryComponent")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!payroll) {
    throw new Error("Payroll not found.");
  }

  return payroll;
};

export const generateAllPayrollService = async (
  payrollMonth,
  payrollYear,
  userId,
) => {
  const employees = await Employee.find({
    isActive: true,
  }).select("_id firstName middleName lastName employeeCode");

  const generatedPayrolls = [];
  const failedPayrolls = [];

  for (const employee of employees) {
    try {
      const payroll = await generatePayrollService(
        employee._id,
        payrollMonth,
        payrollYear,
        userId,
      );

      generatedPayrolls.push({
        employeeId: employee._id,
        employeeCode: employee.employeeCode,
        employeeName:
          `${employee.firstName} ${employee.middleName} ${employee.lastName}`
            .replace(/\s+/g, " ")
            .trim(),
        payrollId: payroll._id,
      });
    } catch (error) {
      failedPayrolls.push({
        employeeId: employee._id,
        employeeCode: employee.employeeCode,
        employeeName:
          `${employee.firstName} ${employee.middleName} ${employee.lastName}`
            .replace(/\s+/g, " ")
            .trim(),
        reason: error.message,
      });
    }
  }

  return {
    totalEmployees: employees.length,
    generatedCount: generatedPayrolls.length,
    failedCount: failedPayrolls.length,
    generatedPayrolls,
    failedPayrolls,
  };
};
