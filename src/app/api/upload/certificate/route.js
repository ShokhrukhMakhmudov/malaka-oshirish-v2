import { NextResponse } from "next/server";
import connectMongoDb from "../../../../../lib/mongodb";
import { StudentCourse } from '../../../../../models'
import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  await connectMongoDb();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const certificateNumber = formData.get("certificateNumber");
    const studentId = formData.get("studentId");


    if (!studentId || !file || !certificateNumber) {
      return NextResponse.json(
        { success: false, message: "Ma'lumotlar to'liq emas!" },
        { status: 400 }
      );
    }

      const exists = await StudentCourse.findOne({ certificateNumber })
      if (exists) {
        return NextResponse.json(
          { success: false, message: "Bu sertifikat raqami mavjud!" },
          { status: 400 }
        );
      }

    // Получаем бинарные данные файла
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Папка для сохранения в директорию public/certificates
    const uploadDir = path.join(process.cwd(), "public", "certificates");
    await fs.mkdir(uploadDir, { recursive: true }); // Создаем папку, если её нет

    // имя файла
    const fileName = certificateNumber.replace(/\s/g, "") + `.${file.name.split(".")[1]}`

    // Генерируем путь для файла (убираем пробелы в имени файла)
    const filePath = path.join(uploadDir,fileName );

    // Сохраняем файл
    await fs.writeFile(filePath, fileBuffer);

    // Возвращаем путь относительно директории public (для URL)
    const publicFilePath = path.join(
      "/certificates",
      fileName
    );

    const data = await StudentCourse.updateOne(
      { _id: studentId },
      { $set: { certificateUrl: publicFilePath, certificateNumber } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Fayl muvaffaqiyatli yuklandi",
        data,
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
