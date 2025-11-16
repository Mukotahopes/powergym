import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
