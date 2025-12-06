import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  name: string;
  enrollmentNumber: string;
  branch: string;
  collegeName: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
  name: { type: String },
  enrollmentNumber: { type: String },
  branch: { type: String },
  collegeName: { type: String },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
