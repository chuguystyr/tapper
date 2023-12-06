import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: "users", required: true },
  toUser: { type: Schema.Types.ObjectId, ref: "users", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const MessageModel = mongoose.models.messages || mongoose.model("messages", MessageSchema);

export default MessageModel;
