import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    avatar: {
      type: String,
      default: "/img/avatars/default.png", // будь-яка твоя дефолтна аватарка
    },

    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
