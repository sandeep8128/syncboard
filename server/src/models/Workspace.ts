import mongoose, { Document, Schema } from "mongoose";

export type WorkspaceRole =
  | "owner"
  | "admin"
  | "member";

export interface IWorkspaceMember {
  user: mongoose.Types.ObjectId;
  role: WorkspaceRole;
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  owner: mongoose.Types.ObjectId;
  members: IWorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

const workspaceMemberSchema =
  new Schema<IWorkspaceMember>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      role: {
        type: String,
        enum: ["owner", "admin", "member"],
        default: "member",
      },

      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
    { _id: false }
  );

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: {
      type: [workspaceMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Workspace =
  mongoose.model<IWorkspace>(
    "Workspace",
    workspaceSchema
  );