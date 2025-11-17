import { Schema, model, models } from "mongoose";

const NewsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    // Короткий опис (для картки)
    shortDescription: { type: String, required: true },

    // Повний опис (для модального вікна)
    fullDescription: { type: String, required: true },

    image: { type: String },
    tags: [{ type: String }],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const News = models.News || model("News", NewsSchema);
export default News;
