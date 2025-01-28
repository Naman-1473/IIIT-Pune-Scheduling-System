import mongoose, { Schema } from "mongoose";

const instructorSchema = new Schema(
  {
    instructorName: {
      type: String,
      required: true,
      index: true,
    }
  },
  { timestamps: true }
);

export const Instructor = mongoose.model("Instructor", instructorSchema);
