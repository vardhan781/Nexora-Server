import Client from "../models/clientModel.js";
import Employee from "../models/employeeModel.js";

export const createClientService = async (data, userId) => {
  const {
    companyName,
    contactPerson,
    email,
    mobileNumber,
    website,
    address,
    assignedTo,
    remarks,
  } = data;

  if (assignedTo) {
    const assignedEmployee = await Employee.findOne({
      _id: assignedTo,
      isActive: true,
    });

    if (!assignedEmployee) {
      throw new Error("Assigned employee not found");
    }
  }

  const lastClient = await Client.findOne().sort({ clientCode: -1 });

  let clientCode = "CLIENT0001";

  if (lastClient) {
    const lastNumber = parseInt(
      lastClient.clientCode.replace("CLIENT", ""),
      10,
    );

    clientCode = `CLIENT${String(lastNumber + 1).padStart(4, "0")}`;
  }

  const client = await Client.create({
    clientCode,
    companyName: companyName.trim(),
    contactPerson: contactPerson?.trim() || "",
    email: email?.trim().toLowerCase() || "",
    mobileNumber: mobileNumber?.trim() || "",
    website: website?.trim() || "",
    address: address || {},
    assignedTo: assignedTo || null,
    remarks: remarks?.trim() || "",
    createdBy: userId,
  });

  return Client.findById(client._id)
    .populate("assignedTo")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");
};

export const getClientsService = async () => {
  const clients = await Client.find({ isActive: true })
    .populate("assignedTo")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort({ createdAt: -1 });

  return clients;
};

export const getMyClientsService = async (userId) => {
  const loggedInEmployee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!loggedInEmployee) {
    throw new Error("Logged in employee not found");
  }

  const clients = await Client.find({
    assignedTo: loggedInEmployee._id,
    isActive: true,
  })
    .populate("assignedTo")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort({ createdAt: -1 });

  return clients;
};

export const getClientByIdService = async (clientId) => {
  const client = await Client.findOne({
    _id: clientId,
    isActive: true,
  })
    .populate("assignedTo")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!client) {
    throw new Error("Client not found");
  }

  return client;
};

export const updateClientService = async (clientId, data, userId) => {
  const client = await Client.findOne({
    _id: clientId,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const {
    companyName,
    contactPerson,
    email,
    mobileNumber,
    website,
    address,
    assignedTo,
    remarks,
  } = data;

  if (assignedTo) {
    const assignedEmployee = await Employee.findOne({
      _id: assignedTo,
      isActive: true,
    });

    if (!assignedEmployee) {
      throw new Error("Assigned employee not found");
    }

    client.assignedTo = assignedTo;
  }

  if (companyName !== undefined) {
    client.companyName = companyName.trim();
  }

  if (contactPerson !== undefined) {
    client.contactPerson = contactPerson?.trim() || "";
  }

  if (email !== undefined) {
    client.email = email?.trim().toLowerCase() || "";
  }

  if (mobileNumber !== undefined) {
    client.mobileNumber = mobileNumber?.trim() || "";
  }

  if (website !== undefined) {
    client.website = website?.trim() || "";
  }

  if (address !== undefined) {
    client.address = address;
  }

  if (remarks !== undefined) {
    client.remarks = remarks?.trim() || "";
  }

  client.updatedBy = userId;

  await client.save();

  return Client.findById(client._id)
    .populate("assignedTo")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");
};

export const assignClientService = async (clientId, assignedTo, userId) => {
  const client = await Client.findOne({
    _id: clientId,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const assignedEmployee = await Employee.findOne({
    _id: assignedTo,
    isActive: true,
  });

  if (!assignedEmployee) {
    throw new Error("Assigned employee not found");
  }

  client.assignedTo = assignedTo;
  client.updatedBy = userId;

  await client.save();

  return Client.findById(client._id)
    .populate("assignedTo")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");
};

export const deleteClientService = async (clientId, userId) => {
  const client = await Client.findOne({
    _id: clientId,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client not found");
  }

  client.isActive = false;
  client.updatedBy = userId;

  await client.save();

  return client;
};
