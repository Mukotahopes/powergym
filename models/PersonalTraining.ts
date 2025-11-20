import { Schema, model, models } from "mongoose";

const PersonalTrainingSchema = new Schema(
  {
    userId: { type: String, required: true },
    trainerId: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true }, // наприклад: "кардіо", "силове", "функціональне"
    comment: { type: String },
    status: { type: String, default: "scheduled" }, // scheduled, done, canceled
  },
  { timestamps: true }
);

export default models.PersonalTraining || model("PersonalTraining", PersonalTrainingSchema);
