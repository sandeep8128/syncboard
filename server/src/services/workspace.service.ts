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