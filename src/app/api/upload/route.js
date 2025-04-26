import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectMongoDb from "../../../../lib/mongodb";
import { Student, StudentCourse } from "../../../../models";


await connectMongoDb();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const courseId = formData.get("courseId");
    const file = formData.get("file");

    if (!courseId || !file) {
      return NextResponse.json(
        { success: false, message: "Курс и файл обязательны" },
        { status: 400 }
      );
    }

    // Проверка типа файла
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return NextResponse.json(
        { success: false, message: "Файл должен быть в формате Excel (.xlsx)" },
        { status: 400 }
      );
    }

    // Чтение Excel-файла
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (const item of data) {
      const { F_I_O, Unvoni, ID, JSHSHIR } = item;

      // Поиск студента по ID и JSHSHIR
      let student = await Student.findOne({
        passportSeries: ID,
        jshir: JSHSHIR,
      });

      if (student) {
        const studentCourse = new StudentCourse({
          student: student._id,
          course: courseId,
          examResult: false, // По умолчанию экзамен не сдан
        });
        await studentCourse.save();
      } else {
        // Если студент не существует, создаем нового
        student = new Student({
          fullName: F_I_O,
          rank: Unvoni,
          passportSeries: ID,
          jshir: JSHSHIR,
        });
        await student.save();

        // Создаем запись о курсе студента
        const studentCourse = new StudentCourse({
          student: student._id,
          course: courseId,
          examResult: false, // По умолчанию экзамен не сдан
        });
        await studentCourse.save();
      }
    }
    return NextResponse.json(
      {
        success: true,
        message: "Файл успешно обработан",
        data: { data, courseId },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
