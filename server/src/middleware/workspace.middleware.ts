import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "./auth.middleware.js";
import { Workspace, WorkspaceRole } from "../models/Workspace.js";

/*
 * Workspace RBAC Middleware
 *
 * Ye middleware check karta hai:
 *
 * 1. User logged in hai ya nahi
 * 2. Workspace exist karta hai ya nahi
 * 3. User workspace ka member hai ya nahi
 * 4. User ke paas required role hai ya nahi

 */

export const workspaceRole = (...allowedRoles: WorkspaceRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // JWT middleware se authenticated user ki ID milti hai
      const userId = req.user?.id;

      const workspaceId = req.params.workspaceId as string;

      // User authenticated nahi hai
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

     
      // Workspace ID exist karta hai ya nahi + valid MongoDB ObjectId hai ya nahi check
      if (!workspaceId ||
         !mongoose.Types.ObjectId.isValid(workspaceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid workspace ID",
        });
      }

      // Database se workspace find kar rahe hain
      const workspace = await Workspace.findById(workspaceId);

      // Workspace exist nahi karta
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      // Check karo current user workspace ka member hai ya nahi
      const membership = workspace.members.find(
        (member) => member.user.toString() === userId,
      );

      // User workspace ka member nahi hai
      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this workspace",
        });
      }

      // User ka role allowed roles mein hai ya nahi
      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission for this action",
        });
      }

      // Agar sab checks pass ho gaye
      // to next middleware/controller par jayega
      next();
    } catch (error) {
      console.error("Workspace authorization error:", error);

      return res.status(500).json({
        success: false,
        message: "Workspace authorization failed",
      });
    }
  };
};
