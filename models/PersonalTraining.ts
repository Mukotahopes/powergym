import mongoose, { Schema, model, models } from "mongoose";

const PersonalTrainingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    title: { type: String, required: true },
    plan: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: "planned" }, // planned / done / cancelled
  },
  { timestamps: true }
);

const PersonalTraining =
  models.PersonalTraining || model("PersonalTraining", PersonalTrainingSchema);

export default PersonalTraining;
