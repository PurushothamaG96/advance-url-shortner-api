import mongoose, { Schema, Document } from "mongoose";

import { IUrl } from "./url";

export interface UniqueDevices extends Document {
  urlId: IUrl["_id"];
  deviceName: string;
  accessUserId: string;
}

const UniqueDevicesSchema: Schema = new Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
  accessUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceName: { type: String, required: true },
});

export default mongoose.model("UniqueDevices", UniqueDevicesSchema);
