import Holiday from "../models/holidayModel.js";
import { startOfGivenDay } from "../utils/dateUtils.js";

export const getHolidaysService = async () => {
  return await Holiday.find({ isActive: true }).sort({ date: 1 });
};

export const createHolidayService = async (data, userId) => {
  const { name, date, type, description } = data;

  const holidayDate = startOfGivenDay(new Date(date));

  const existingHoliday = await Holiday.findOne({
    isActive: true,
    date: holidayDate,
  });

  if (existingHoliday) {
    throw new Error("Holiday already exists on this date");
  }

  const holiday = await Holiday.create({
    name,
    date: holidayDate,
    type,
    description,
    createdBy: userId,
  });

  return holiday;
};

export const updateHolidayService = async (holidayId, data, userId) => {
  const holiday = await Holiday.findOne({
    _id: holidayId,
    isActive: true,
  });

  if (!holiday) {
    throw new Error("Holiday not found");
  }

  const { name, date, type, description } = data;

  if (date) {
    const holidayDate = startOfGivenDay(new Date(date));

    const existingHoliday = await Holiday.findOne({
      _id: { $ne: holidayId },
      isActive: true,
      date: holidayDate,
    });

    if (existingHoliday) {
      throw new Error("Another holiday already exists on this date");
    }

    holiday.date = holidayDate;
  }

  if (name) holiday.name = name;
  if (type) holiday.type = type;
  if (description !== undefined) holiday.description = description;

  holiday.updatedBy = userId;

  await holiday.save();

  return holiday;
};

export const deleteHolidayService = async (holidayId, userId) => {
  const holiday = await Holiday.findOne({
    _id: holidayId,
    isActive: true,
  });

  if (!holiday) {
    throw new Error("Holiday not found");
  }

  holiday.isActive = false;
  holiday.updatedBy = userId;

  await holiday.save();

  return holiday;
};
