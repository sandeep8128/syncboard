import { Router } from "express";

import {
  addMember,
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  removeMember,
  updateMemberRole,
} from "../controllers/workspace.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { workspaceRole } from "../middleware/workspace.middleware.js";

const router = Router();

router.post("/", protect, createWorkspace);
router.get("/", protect, getMyWorkspaces);
router.get(
  "/:workspaceId",
  protect,
  workspaceRole("owner", "admin", "member"),
  getWorkspace,
);
router.post(
  "/:workspaceId/members",
  protect,
  workspaceRole("owner", "admin"),
  addMember,
);
// Remove a workspace member
router.delete(
  "/:workspaceId/members/:userId",
  protect,
  workspaceRole("owner", "admin"),
  removeMember,
);

// Change a workspace member's role
router.patch(
  "/:workspaceId/members/:userId/role",
  protect,
  workspaceRole("owner", "admin"),
  updateMemberRole,
);
export default router;
