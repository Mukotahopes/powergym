import { Schema, model, models } from "mongoose";

const TrainerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    avatar: {
      type: String,
      default: "/img/trainers/default.jpg",
    },

    // Кількість відгуків
    reviewsCount: {
      type: Number,
      default: 0,
    },

    // Середній рейтинг 1–5
    ratingAverage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Trainer = models.Trainer || model("Trainer", TrainerSchema);
export default Trainer;
