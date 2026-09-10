import {
  assignClientService,
  createClientService,
  deleteClientService,
  getClientByIdService,
  getClientsService,
  getMyClientsService,
  updateClientService,
} from "../services/clientService.js";

export const getClients = async (req, res) => {
  try {
    const clients = await getClientsService();

    return res.status(200).json({
      success: true,
      data: clients,
      message: "Clients fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await createClientService(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      data: client,
      message: "Client created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await getClientByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: client,
      message: "Client fetched successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await updateClientService(
      req.params.id,
      req.body,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      data: client,
      message: "Client updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await deleteClientService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      data: client,
      message: "Client deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyClients = async (req, res) => {
  try {
    const clients = await getMyClientsService(req.user._id);

    return res.status(200).json({
      success: true,
      data: clients,
      message: "My clients fetched successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignClient = async (req, res) => {
  try {
    const client = await assignClientService(
      req.params.id,
      req.body.assignedTo,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      data: client,
      message: "Client assigned successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
