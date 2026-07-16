import RunningNumber from "../models/runningNumberModel.js";

export const generateCode = async (module) => {
  const runningNumber = await RunningNumber.findOne({
    module: module.toUpperCase(),
    isActive: true,
  });

  if (!runningNumber) {
    throw new Error(`${module} running number configuration not found`);
  }

  runningNumber.lastNumber += 1;

  await runningNumber.save();

  const number = String(runningNumber.lastNumber).padStart(
    runningNumber.numberLength,
    "0",
  );

  return `${runningNumber.prefix}${number}`;
};
