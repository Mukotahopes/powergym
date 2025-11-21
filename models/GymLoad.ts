import { Schema, model, models } from "mongoose";

const GymLoadSchema = new Schema(
  {
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.GymLoad || model("GymLoad", GymLoadSchema);
