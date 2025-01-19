import mongoose, { Schema, Document } from "mongoose";
import { IUrl } from "./url";
import { IUser } from "./user";

export interface IAnalytics extends Document {
  shortUrl: IUrl["_id"];
  accessUserId: IUser["_id"];
  ipAddress: string;
  osName: string;
  deviceName: string;
  geoLocator: string;
  accessedAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    shortUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
    accessUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ipAddress: { type: String, required: true },
    osName: { type: String, required: true },
    deviceName: { type: String, required: true },
    geoLocator: { type: String, required: true },
    accessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
