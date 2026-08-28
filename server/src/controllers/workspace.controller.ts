import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import * as workspaceService from "../services/workspace.service.js";
import { Workspace } from "../models/Workspace.js";
import { WorkspaceRole } from "../models/Workspace.js";

/*
 * Create a new workspace
 */
export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    // Request body se workspace name
    const { name } = req.body;

    // Workspace name required hai
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required",
      });
    }

    // JWT middleware se logged-in user ki ID
    const userId = req.user?.id;

    // User authenticated nahi hai
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Service ko workspace create karne do
    const workspace = await workspaceService.createWorkspace({
      name,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: {
        workspace,
      },
    });
  } catch (error) {
    console.error("Create workspace error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create workspace",
    });
  }
};

/*
 * Get all workspaces of logged-in user
 */
export const getMyWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    // JWT middleware se user ID
    const userId = req.user?.id;

    // User authenticated nahi hai
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // User ke workspaces service se fetch karo
    const workspaces = await workspaceService.getMyWorkspaces(userId);

    return res.status(200).json({
      success: true,
      data: {
        workspaces,
      },
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
    });
  }
};

/*
 * Get a single workspace
 *
 * Workspace role middleware pehle check karega
 * ki user ko workspace access hai ya nahi.
 */
export const getWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    // URL params se workspace ID
    const workspaceId = req.params.workspaceId as string;

    // Workspace ID missing hai
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    // Database se workspace fetch karo
    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email avatar",
    );

    // Workspace nahi mila
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        workspace,
      },
    });
  } catch (error) {
    console.error("Get workspace error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspace",
    });
  }
};

/*
 * Add a member to workspace
 *
 * Authorization middleware pehle check karega
 * ki current user Owner ya Admin hai.
 */
export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    // URL params se workspace ID
    const workspaceId = req.params.workspaceId as string;

    // Request body se email aur role
    const { email, role } = req.body;

    // Workspace ID required hai
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    // Email required aur string honi chahiye
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    // Role required hai
    if (!role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // Sirf admin aur member add kar sakte hain
    // Owner role ko API se assign nahi karenge
    if (role !== "admin" && role !== "member") {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // TypeScript ko confirm kar rahe hain
    // ki role valid WorkspaceRole hai
    const workspaceRole: WorkspaceRole = role;

    // Service business logic handle karegi
    const workspace = await workspaceService.addWorkspaceMember(
      workspaceId,
      email,
      workspaceRole,
    );

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: {
        workspace,
      },
    });
  } catch (error) {
    // Target user database mein nahi mila
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Workspace nahi mila
    if (error instanceof Error && error.message === "WORKSPACE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // User already workspace member hai
    if (error instanceof Error && error.message === "ALREADY_MEMBER") {
      return res.status(409).json({
        success: false,
        message: "User is already a workspace member",
      });
    }

    // Unknown server error
    console.error("Add member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add workspace member",
    });
  }
};

// Remove a member from a workspace
export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    // URL params se IDs nikal rahe hain
    const workspaceId = req.params.workspaceId as string;

    const userId = req.params.userId as string;

    // Workspace ID required hai
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    // User ID required hai
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Workspace se member remove karo
    const workspace = await workspaceService.removeWorkspaceMember(
      workspaceId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: {
        workspace,
      },
    });
  } catch (error) {
    // Workspace nahi mila
    if (error instanceof Error && error.message === "WORKSPACE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Member nahi mila
    if (error instanceof Error && error.message === "MEMBER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Workspace owner ko remove nahi kar sakte
    if (error instanceof Error && error.message === "CANNOT_REMOVE_OWNER") {
      return res.status(400).json({
        success: false,
        message: "Workspace owner cannot be removed",
      });
    }

    // Unknown error
    console.error("Remove member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove workspace member",
    });
  }
};


// Change a workspace member's role
export const updateMemberRole = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.params.userId as string;
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const workspace =
      await workspaceService.updateWorkspaceMemberRole(
        workspaceId,
        userId,
        role as "admin" | "member"
      );

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: {
        workspace,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "WORKSPACE_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (
      error instanceof Error &&
      error.message === "MEMBER_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (
      error instanceof Error &&
      error.message === "CANNOT_CHANGE_OWNER_ROLE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Owner role cannot be changed",
      });
    }

    console.error("Update member role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update member role",
    });
  }
};