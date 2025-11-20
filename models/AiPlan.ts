import mongoose, { Schema, model, models } from "mongoose";

const AiPlanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: Number,
    sex: String,
    goal: String,
    level: String,
    frequency: String,
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AiPlan = models.AiPlan || model("AiPlan", AiPlanSchema);

export default AiPlan;
