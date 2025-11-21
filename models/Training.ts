import { Schema, model, models } from "mongoose";

const TrainingSchema = new Schema(
  {
    title: { type: String, required: true },

    category: {
      type: String,
      enum: ["cardio", "functional", "strength"],
      default: "cardio",
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    durationMin: { type: Number, default: 45 },
    description: { type: String },

    rating: { type: Number, default: 0 },
    // Optional start date/time of the training
    startAt: { type: Date },
    coach: { type: String },
    slug: { type: String, unique: true, sparse: true },
    minSubscription: {
      type: String,
      enum: ["free", "plus", "premium"],
      default: "free",
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
    },

    // Cover image for the training card
    image: { type: String },
  },
  { timestamps: true }
);

export default models.Training || model("Training", TrainingSchema);
