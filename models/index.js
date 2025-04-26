// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
    passportSeries: {
      type: String,
      required: true,
      unique: true,
    },
    jshir: {
      type: String,
      required: true,
      unique: true,
    },
    photo: { type: String },
  },
  {
    toJSON: { virtuals: true }, // Включаем виртуальные поля при конвертации в JSON
    toObject: { virtuals: true }, // Включаем виртуальные поля при конвертации в объект
  }
);

// Добавляем виртуальное поле для связи с курсами
studentSchema.virtual("courses", {
  ref: "StudentCourse", // Связь с моделью StudentCourse
  localField: "_id", // Поле в текущей модели
  foreignField: "student", // Поле в связанной модели
  justOne: false, // Получаем массив записей
});

export const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

const studentCourseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  examResult: {
    type: Boolean,
    default: false,
  },
  certificateNumber: {
    type: String,
    default: null,
    index: true,
  },
  certificateUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


studentCourseSchema.index(
  { certificateNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { certificateNumber: { $ne: null } },
  }
);
export const StudentCourse =
  mongoose.models.StudentCourse ||
  mongoose.model("StudentCourse", studentCourseSchema);

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

export const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
