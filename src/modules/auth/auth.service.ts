import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";
import { StatusCodes } from "http-status-codes";
import { RegisterInput, LoginInput } from "../../validations/user.validation";
import { uploadToCloudinary } from "../../utils/upload.util";
import { envVars } from "../../config/env.config";

export const registerUser = async (data: RegisterInput) => {
  const { name, email, password, role, profileImage } = data;
  console.log(profileImage);

  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) {
    const error = new Error("Email already exists") as any;
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const imageFields: { profileImage?: string } = {};
  if (profileImage && profileImage.size > 0) {
    imageFields.profileImage = await uploadToCloudinary(profileImage);
  }
  console.log(imageFields);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    ...imageFields,
  });

  const userObject = user.toObject();
  delete (userObject as any).password;

  return {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: userObject,
  };
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await User.findOne({ email, isDeleted: false }).select(
    "+password",
  );
  if (!user) {
    const error = new Error("Invalid email or password") as any;
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password as string,
  );
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password") as any;
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: user._id.toString(),
    role: user.role as "Admin" | "Manager" | "Employee",
  };
  const token = jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: "7d",
  });

  const userObject = user.toObject();
  delete (userObject as any).password;

  return {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Login successful",
    data: { user: userObject, token },
  };
};
