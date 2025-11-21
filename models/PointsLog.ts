import { Schema, model, models } from "mongoose";

const PointsLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number, required: true },
    date: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default models.PointsLog || model("PointsLog", PointsLogSchema);
