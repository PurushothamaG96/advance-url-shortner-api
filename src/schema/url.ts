import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IUrl extends Document {
  createdUserId: IUser["_id"];
  longUrl: string;
  shortCode: string;
  topic?: string;
  createdAt: Date;

  analytics: mongoose.Types.ObjectId[];
  uniqueOS: mongoose.Types.ObjectId[];
  uniqueDevices: mongoose.Types.ObjectId[];
}

const UrlSchema: Schema = new Schema(
  {
    createdUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    longUrl: { type: String, required: true },
    shortCode: { type: String, unique: true, required: true },
    topic: { type: String },
    analytics: [{ type: Schema.Types.ObjectId, ref: "Analytics" }],
    uniqueOS: [{ type: Schema.Types.ObjectId, ref: "UniqueOS" }],
    uniqueDevices: [{ type: Schema.Types.ObjectId, ref: "UniqueDevices" }],
  },
  { timestamps: { createdAt: "createdAt" } }
);

export default mongoose.model<IUrl>("Url", UrlSchema);
