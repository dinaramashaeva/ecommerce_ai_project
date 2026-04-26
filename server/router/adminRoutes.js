import express from "express";
import {
  getAllUsers,
  deleteUser,
  dashboardStats,
  updateUserRole,
} from "../controllers/adminController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/getallusers",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteUser
);

router.get(
  "/fetch/dashboard-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats
);

router.put(
  "/update-role/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateUserRole
);

export default router;