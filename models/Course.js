// models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Уникальное название курса
  },
  prefix: {
    type: String,
    required: true,
    unique: true, // Уникальный префикс курса
  },
});

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
