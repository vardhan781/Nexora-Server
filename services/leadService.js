import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import Lead from "../models/leadModel.js";
import LeadSource from "../models/leadSourceModel.js";
import LeadStatus from "../models/leadStatusModel.js";
import Client from "../models/clientModel.js";

export const createLeadService = async (data, userId) => {
  const {
    leadName,
    companyName,
    email,
    mobileNumber,
    leadStatus,
    leadSource,
    assignedTo,
    remarks,
  } = data;

  const assignedEmployee = await Employee.findOne({
    _id: assignedTo,
    isActive: true,
  });

  if (!assignedEmployee) {
    throw new Error("Assigned employee not found");
  }

  const status = await LeadStatus.findOne({
    _id: leadStatus,
    isActive: true,
  });

  if (!status) {
    throw new Error("Lead status not found");
  }

  const source = await LeadSource.findOne({
    _id: leadSource,
    isActive: true,
  });

  if (!source) {
    throw new Error("Lead source not found");
  }

  const lastLead = await Lead.findOne().sort({ leadCode: -1 });

  let leadCode = "LEAD0001";

  if (lastLead) {
    const lastNumber = parseInt(lastLead.leadCode.replace("LEAD", ""), 10);

    leadCode = `LEAD${String(lastNumber + 1).padStart(4, "0")}`;
  }

  const lead = await Lead.create({
    leadCode,
    leadName: leadName.trim(),
    companyName: companyName?.trim() || "",
    email: email?.trim() || "",
    mobileNumber: mobileNumber?.trim() || "",
    leadStatus: status._id,
    leadSource: source._id,
    assignedTo: assignedEmployee._id,
    remarks: remarks?.trim() || "",
    createdBy: userId,
  });

  return Lead.findById(lead._id)
    .populate("leadStatus", "name code")
    .populate("leadSource", "name code")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("createdBy", "name officialEmail");
};

export const getLeadsService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    leadStatus,
    leadSource,
    assignedTo,
  } = query;

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);

  const filter = {
    isActive: true,
  };

  const searchValue = search.trim();

  if (searchValue) {
    filter.$or = [
      {
        leadCode: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        leadName: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        companyName: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        mobileNumber: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  if (leadStatus) {
    filter.leadStatus = leadStatus;
  }

  if (leadSource) {
    filter.leadSource = leadSource;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  const totalRecords = await Lead.countDocuments(filter);

  const leads = await Lead.find(filter)
    .populate("leadStatus", "name code")
    .populate("leadSource", "name code")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("createdBy", "name officialEmail")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  return {
    leads,
    pagination: {
      totalRecords,
      currentPage,
      totalPages: Math.ceil(totalRecords / pageSize),
      pageSize,
    },
  };
};

export const getMyLeadsService = async (userId, query) => {
  const { page = 1, limit = 10, search = "", leadStatus, leadSource } = query;

  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);

  const filter = {
    assignedTo: employee._id,
    isActive: true,
  };

  const searchValue = search.trim();

  if (searchValue) {
    filter.$or = [
      {
        leadCode: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        leadName: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        companyName: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        mobileNumber: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  if (leadStatus) {
    filter.leadStatus = leadStatus;
  }

  if (leadSource) {
    filter.leadSource = leadSource;
  }

  const totalRecords = await Lead.countDocuments(filter);

  const leads = await Lead.find(filter)
    .populate("leadStatus", "name code")
    .populate("leadSource", "name code")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("createdBy", "name officialEmail")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  return {
    leads,
    pagination: {
      totalRecords,
      currentPage,
      totalPages: Math.ceil(totalRecords / pageSize),
      pageSize,
    },
  };
};

export const getLeadByIdService = async (leadId) => {
  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  })
    .populate("leadStatus", "name code description")
    .populate("leadSource", "name code description")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("convertedClient")
    .populate("createdBy", "name officialEmail")
    .populate("updatedBy", "name officialEmail");

  if (!lead) {
    throw new Error("Lead not found");
  }

  return lead;
};

export const updateLeadService = async (leadId, data, userId) => {
  const {
    leadName,
    companyName,
    email,
    mobileNumber,
    leadStatus,
    leadSource,
    assignedTo,
    remarks,
  } = data;

  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (assignedTo !== undefined) {
    const assignedEmployee = await Employee.findOne({
      _id: assignedTo,
      isActive: true,
    });

    if (!assignedEmployee) {
      throw new Error("Assigned employee not found");
    }

    lead.assignedTo = assignedEmployee._id;
  }

  if (leadStatus !== undefined) {
    const status = await LeadStatus.findOne({
      _id: leadStatus,
      isActive: true,
    });

    if (!status) {
      throw new Error("Lead status not found");
    }

    lead.leadStatus = status._id;
  }

  if (leadSource !== undefined) {
    const source = await LeadSource.findOne({
      _id: leadSource,
      isActive: true,
    });

    if (!source) {
      throw new Error("Lead source not found");
    }

    lead.leadSource = source._id;
  }

  if (leadName !== undefined) {
    lead.leadName = leadName.trim();
  }

  if (companyName !== undefined) {
    lead.companyName = companyName?.trim() || "";
  }

  if (email !== undefined) {
    lead.email = email?.trim() || "";
  }

  if (mobileNumber !== undefined) {
    lead.mobileNumber = mobileNumber?.trim() || "";
  }

  if (remarks !== undefined) {
    lead.remarks = remarks?.trim() || "";
  }

  lead.updatedBy = userId;

  await lead.save();

  return Lead.findById(lead._id)
    .populate("leadStatus", "name code")
    .populate("leadSource", "name code")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("createdBy", "name officialEmail")
    .populate("updatedBy", "name officialEmail");
};

export const deleteLeadService = async (leadId, userId) => {
  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  lead.isActive = false;
  lead.updatedBy = userId;

  await lead.save();

  return lead;
};
export const assignLeadService = async (leadId, assignedTo, userId) => {
  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  const assignedEmployee = await Employee.findOne({
    _id: assignedTo,
    isActive: true,
  });

  if (!assignedEmployee) {
    throw new Error("Assigned employee not found");
  }

  lead.assignedTo = assignedEmployee._id;
  lead.updatedBy = userId;

  await lead.save();

  return Lead.findById(lead._id)
    .populate("leadStatus", "name code")
    .populate("leadSource", "name code")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("createdBy", "name officialEmail")
    .populate("updatedBy", "name officialEmail");
};

export const updateLeadStatusService = async (leadId, leadStatus, userId) => {
  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  const status = await LeadStatus.findOne({
    _id: leadStatus,
    isActive: true,
  });

  if (!status) {
    throw new Error("Lead status not found");
  }

  // Prevent status changes after conversion
  const currentStatus = await LeadStatus.findById(lead.leadStatus);

  if (currentStatus?.code === "CONVERTED") {
    throw new Error("Converted lead status cannot be changed");
  }

  lead.leadStatus = status._id;
  lead.updatedBy = userId;

  await lead.save();

  return Lead.findById(lead._id)
    .populate("leadStatus", "name code")
    .populate("leadSource", "name code")
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("createdBy", "name officialEmail")
    .populate("updatedBy", "name officialEmail");
};

export const getLeadStatsService = async () => {
  const activeFilter = {
    isActive: true,
  };

  const totalLeads = await Lead.countDocuments(activeFilter);

  const statusStats = await Lead.aggregate([
    {
      $match: activeFilter,
    },
    {
      $lookup: {
        from: "leadstatuses",
        localField: "leadStatus",
        foreignField: "_id",
        as: "status",
      },
    },
    {
      $unwind: "$status",
    },
    {
      $group: {
        _id: {
          name: "$status.name",
          code: "$status.code",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  const sourceStats = await Lead.aggregate([
    {
      $match: activeFilter,
    },
    {
      $lookup: {
        from: "leadsources",
        localField: "leadSource",
        foreignField: "_id",
        as: "source",
      },
    },
    {
      $unwind: "$source",
    },
    {
      $group: {
        _id: {
          name: "$source.name",
          code: "$source.code",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  const assignedStats = await Lead.aggregate([
    {
      $match: activeFilter,
    },
    {
      $lookup: {
        from: "employees",
        localField: "assignedTo",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $group: {
        _id: "$employee._id",
        employeeCode: {
          $first: "$employee.employeeCode",
        },
        firstName: {
          $first: "$employee.firstName",
        },
        lastName: {
          $first: "$employee.lastName",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  const convertedLeads = await Lead.countDocuments({
    ...activeFilter,
    convertedClient: {
      $ne: null,
    },
  });

  const lostStatus = await LeadStatus.findOne({
    code: "LOST",
    isActive: true,
  });

  const lostLeads = lostStatus
    ? await Lead.countDocuments({
        ...activeFilter,
        leadStatus: lostStatus._id,
      })
    : 0;

  return {
    totalLeads,
    convertedLeads,
    lostLeads,
    statusStats,
    sourceStats,
    assignedStats,
  };
};

export const convertLeadService = async (leadId, userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const lead = await Lead.findOne({
      _id: leadId,
      isActive: true,
    }).session(session);

    if (!lead) {
      throw new Error("Lead not found");
    }

    const currentStatus = await LeadStatus.findById(lead.leadStatus).session(
      session,
    );

    if (!currentStatus) {
      throw new Error("Lead status not found");
    }

    if (currentStatus.code === "CONVERTED") {
      throw new Error("Lead is already converted");
    }

    if (currentStatus.code !== "QUALIFIED") {
      throw new Error("Only qualified leads can be converted");
    }

    if (!lead.companyName?.trim()) {
      throw new Error("Company name is required to convert lead");
    }

    const convertedStatus = await LeadStatus.findOne({
      code: "CONVERTED",
      isActive: true,
    }).session(session);

    if (!convertedStatus) {
      throw new Error("Converted lead status not found");
    }

    const lastClient = await Client.findOne()
      .sort({ clientCode: -1 })
      .session(session);

    let clientCode = "CLIENT0001";

    if (lastClient) {
      const lastNumber = parseInt(
        lastClient.clientCode.replace("CLIENT", ""),
        10,
      );

      if (!Number.isNaN(lastNumber)) {
        clientCode = `CLIENT${String(lastNumber + 1).padStart(4, "0")}`;
      }
    }

    const [client] = await Client.create(
      [
        {
          clientCode,
          companyName: lead.companyName.trim(),
          contactPerson: lead.leadName?.trim() || "",
          email: lead.email?.trim().toLowerCase() || "",
          mobileNumber: lead.mobileNumber?.trim() || "",
          website: "",
          address: {},
          assignedTo: null,
          remarks: lead.remarks?.trim() || "",
          createdBy: userId,
        },
      ],
      { session },
    );

    lead.leadStatus = convertedStatus._id;
    lead.convertedClient = client._id;
    lead.updatedBy = userId;

    await lead.save({ session });

    await session.commitTransaction();

    const convertedLead = await Lead.findById(lead._id)
      .populate("leadStatus", "name code description")
      .populate("leadSource", "name code description")
      .populate("assignedTo")
      .populate("convertedClient")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return convertedLead;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
