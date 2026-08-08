import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/database.js";
import authRouter from "./routes/authRoutes.js";
import menuRouter from "./routes/menuRoutes.js";
import menuRightRouter from "./routes/menuRightRoutes.js";
import roleRouter from "./routes/roleRoutes.js";
import userRouter from "./routes/userRoutes.js";
import departmentRouter from "./routes/departmentRoutes.js";
import designationRouter from "./routes/designationRoute.js";
import employeeTypeRouter from "./routes/employeeTypeRoutes.js";
import employeeStatusRouter from "./routes/employeeStatusRouter.js";
import employeeRouter from "./routes/employeeRoute.js";
import holidayRouter from "./routes/holidayRouter.js";
import shiftRouter from "./routes/shiftRouter.js";
import requestStatusRouter from "./routes/requestStatusRoutes.js";
import attendanceStatusRouter from "./routes/attendanceStatusRoutes.js";
import leaveTypeRouter from "./routes/leaveTypeRoutes.js";
import leaveBalanceRouter from "./routes/leaveBalanceRoutes.js";
import leaveRequestRouter from "./routes/leaveRequestRoutes.js";
import leaveApprovalRouter from "./routes/leaveApprovalRouter.js";
import { startAttendanceScheduler } from "./utils/attendanceScheduler.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import payrollSettingRouter from "./routes/payrollSettingRoutes.js";
import salaryComponentRouter from "./routes/salaryComponentRoutes.js";
import employeeSalaryRouter from "./routes/employeeSalaryRoutes.js";
import payrollRouter from "./routes/payrollRoutes.js";
import taskStatusRouter from "./routes/taskStatusRoutes.js";
import taskPriorityRouter from "./routes/taskPriorityRoutes.js";
import taskRouter from "./routes/taskRoutes.js";

dotenv.config();
connectDB();
startAttendanceScheduler();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Nexora API is running 🚀" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);
app.use("/api/menu-rights", menuRightRouter);
app.use("/api/roles", roleRouter);
app.use("/api/users", userRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/designations", designationRouter);
app.use("/api/employee-types", employeeTypeRouter);
app.use("/api/employee-status", employeeStatusRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/holiday", holidayRouter);
app.use("/api/shift", shiftRouter);
app.use("/api/request-status", requestStatusRouter);
app.use("/api/attendance-status", attendanceStatusRouter);
app.use("/api/leave-types", leaveTypeRouter);
app.use("/api/leave-balance", leaveBalanceRouter);
app.use("/api/leave-request", leaveRequestRouter);
app.use("/api/leave-approval", leaveApprovalRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/payroll-settings", payrollSettingRouter);
app.use("/api/salary-component", salaryComponentRouter);
app.use("/api/employee-salary", employeeSalaryRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/task-status", taskStatusRouter);
app.use("/api/task-priority", taskPriorityRouter);
app.use("/api/task", taskRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
