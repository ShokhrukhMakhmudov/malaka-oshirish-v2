"use server";
import connectMongoDb from "../../../lib/mongodb";
import { Student } from "../../../models";
// Функция для поиска выпускника
async function findStudent(passportSeries, jshir) {
  await connectMongoDb();
  try {
    // Ищем выпускника по серии и номеру паспорта, а также по JSHIR
    const student = await Student.findOne({
      passportSeries,
      jshir,
    });

    if (student) {
      return JSON.stringify(student); // Возвращаем найденного выпускника
    } else {
      return null; // Выпускник не найден
    }
  } catch (error) {
    console.log("Ошибка при поиске выпускника:", error);
    throw error;
  }
}

export default findStudent;
