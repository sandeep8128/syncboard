import { Router } from "express";

import {
    addMember,
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
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
  addMember
);

export default router;
