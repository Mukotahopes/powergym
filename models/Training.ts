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

    // рейтинг конкретного тренування (може знадобитись пізніше)
    rating: { type: Number, default: 0 },

    // запасне текстове поле, якщо колись було без Trainer
    coach: { type: String },

    // посилання на тренера
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
    },
  },
  { timestamps: true }
);

export default models.Training || model("Training", TrainingSchema);
