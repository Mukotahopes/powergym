import mongoose, { Schema, models, model } from "mongoose";

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    training: {
      type: Schema.Types.ObjectId,
      ref: "Training",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
