import mongoose, { Schema, Document } from "mongoose";

import { IUrl } from "./url";

export interface UniqueOS extends Document {
  urlId: IUrl["_id"];
  osName: string;
  accessUserId: string;
}


const UniqueOSSchema: Schema = new Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
  accessUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  osName: { type: String, required: true },
});

export default mongoose.model("UniqueOS", UniqueOSSchema);
