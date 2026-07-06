import mongoose, { Schema, Document } from "mongoose";
import { Role } from "../types/user.types";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  profileImage?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: [Role.Admin, Role.Manager, Role.Employee],
      required: true,
      default: Role.Employee,
    },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
