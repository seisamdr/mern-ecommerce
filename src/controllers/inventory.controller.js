import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

// getInventories,
export const getInventories = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany();
    return successResponse(res, "Get inventory successful", inventories);
  } catch (error) {
    return errorResponse(res, "Failed to retrieve inventories", null, 500);
  }
};

// getInventory,
export const getInventory = async (req, res) => {
  const { id } = req.params;

  if (!id) return errorResponse(res, "ID is required", null, 400);

  try {
    const inventory = await prisma.inventory.findUnique({ where: { id } });

    if (!inventory) {
      return errorResponse(res, "Inventory not found", null, 404);
    }

    return successResponse(res, "Get inventory by ID successful", inventory);
  } catch (error) {
    return errorResponse(res, "Failed to retrieve inventory", null, 500);
  }
};

// createInventory,
export const createInventory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    return errorResponse(res, "Name and description are required", null, 400);

  try {
    const inventory = await prisma.inventory.create({
      data: { name, description },
    });

    return successResponse(res, "Inventory created successfully", inventory);
  } catch (error) {
    return errorResponse(res, "Failed to create inventory", null, 500);
  }
};

// updateInventory,
export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!id) return errorResponse(res, "ID is required", null, 400);

  if (!name || !description)
    return errorResponse(res, "Name and description are required", null, 400);

  try {
    const existingInventory = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingInventory)
      return errorResponse(res, "Inventory not found", null, 404);

    const inventory = await prisma.inventory.update({
      where: { id },
      data: { name, description },
    });

    return successResponse(res, "Inventory updated successfully", inventory);
  } catch (error) {
    return errorResponse(res, "Failed to update inventory", null, 500);
  }
};

// deleteInventory,
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  if (!id) return errorResponse(res, "ID is required", null, 400);

  try {
    const existingInventory = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingInventory)
      return errorResponse(res, "Inventory not found", null, 404);

    const inventory = await prisma.inventory.delete({
      where: { id },
    });

    return successResponse(res, "Inventory deleted successfully", inventory);
  } catch (error) {
    return errorResponse(res, "Failed to delete inventory", null, 500);
  }
};
