import { Schema, model, models } from "mongoose";

const TrainingSchema = new Schema(
  {
    title: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    durationMin: { type: Number, default: 45 },
    description: { type: String },
    rating: { type: Number, default: 0 },
    coach: { type: String },
  },
  { timestamps: true }
);

export default models.Training || model("Training", TrainingSchema);
