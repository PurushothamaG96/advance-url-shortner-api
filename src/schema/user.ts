import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  profileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    googleId: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    profileUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
