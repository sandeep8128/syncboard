import { User } from "../models/User.js";
import {
  Workspace,
  WorkspaceRole,
} from "../models/Workspace.js";

interface CreateWorkspaceInput {
  name: string;
  userId: string;
}

// Create a new workspace
export const createWorkspace = async ({
  name,
  userId,
}: CreateWorkspaceInput) => {
  // Workspace ke liye unique slug create kar rahe hain
  const slug = `${name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}`;

  // Database mein workspace create karo
  const workspace = await Workspace.create({
    name: name.trim(),
    slug,
    owner: userId,

    // Workspace create karne wala user automatically owner hoga
    members: [
      {
        user: userId,
        role: "owner",
      },
    ],
  });

  return workspace;
};

// Current user ke workspaces get karo
export const getMyWorkspaces = async (
  userId: string
) => {
  const workspaces = await Workspace.find({
    "members.user": userId,
  })
    .select(
      "name slug owner members createdAt updatedAt"
    )
    .sort({ createdAt: -1 });

  return workspaces;
};

/*
 * Add a user to a workspace
 *
 * Ye function:
 * 1. Email se user find karega
 * 2. Workspace find karega
 * 3. Check karega user already member hai ya nahi
 * 4. User ko workspace ke members array mein add karega
 */

export const addWorkspaceMember = async (
  workspaceId: string,
  email: string,
  role: WorkspaceRole
) => {
  // Email ko lowercase karke consistent rakhenge
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  // Email se user find karo
  const user = await User.findOne({
    email: normalizedEmail,
  });

  // User registered nahi hai
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Workspace find karo
  const workspace = await Workspace.findById(
    workspaceId
  );

  // Workspace exist nahi karta
  if (!workspace) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  // Check karo user already workspace ka member hai ya nahi
  const alreadyMember = workspace.members.some(
    (member) =>
      member.user.toString() ===
      user._id.toString()
  );

  // User already member hai
  if (alreadyMember) {
    throw new Error("ALREADY_MEMBER");
  }

  // New member ko workspace mein add karo
  workspace.members.push({
    user: user._id,
    role,
    joinedAt: new Date(),
  });

  // Database mein workspace save karo
  await workspace.save();

  return workspace;
};

// Remove a member from a workspace
export const removeWorkspaceMember = async (
  workspaceId: string,
  userId: string
) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  const memberIndex = workspace.members.findIndex(
    (member) => member.user.toString() === userId
  );

  if (memberIndex === -1) {
    throw new Error("MEMBER_NOT_FOUND");
  }

  if (workspace.members[memberIndex].role === "owner") {
    throw new Error("CANNOT_REMOVE_OWNER");
  }

  workspace.members.splice(memberIndex, 1);

  await workspace.save();

  return workspace;
};

// Change a member's role in a workspace
export const updateWorkspaceMemberRole = async (
  workspaceId: string,
  userId: string,
  role: WorkspaceRole
) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  const member = workspace.members.find(
    (member) => member.user.toString() === userId
  );

  if (!member) {
    throw new Error("MEMBER_NOT_FOUND");
  }

  if (member.role === "owner") {
    throw new Error("CANNOT_CHANGE_OWNER_ROLE");
  }

  member.role = role;

  await workspace.save();

  return workspace;
};