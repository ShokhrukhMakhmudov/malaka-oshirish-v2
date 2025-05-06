// app/api/generate-certificate/route.js
import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontKit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { StudentCourse, Course } from "../../../../models";
import connectMongoDb from "../../../../lib/mongodb";

const TEMPLATE_COORDINATES = {
  fullName: { x: "center", y: 340 },
  courseName: { x: "center", y: 470 },
  certificateSeries: { x: "center", y: 372 },
  description: { x: "center", y: 310 },
  date: { x: 232, y: 71 },
  certificateNumber: { x: 706, y: 69 },
  qrCode: { x: 50, y: 30, size: 110 },
};

export async function POST(req) {
  await connectMongoDb();

  try {
    const {
      studentCourseId,
      message,
      date,
      certificateNumber: cerNum,
    } = await req.json();

    const exists = await StudentCourse.findOne({ certificateNumber: cerNum });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Bu sertifikat raqami mavjud!" },
        { status: 400 }
      );
    }

    // Получаем данные
    const studentCourse = await StudentCourse.findById(studentCourseId)
      .populate("student")
      .populate("course");
    console.log(studentCourse);

    if (!studentCourse?.student || !studentCourse?.course) {
      throw new Error("Invalid student course data");
    }

    if (!studentCourse.examResult) {
      throw new Error("Student did not pass the exam");
    }

    // Загружаем шаблон PDF
    const templatePath = path.join(
      process.cwd(),
      "public/certificates/templates/template.pdf"
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error("PDF template not found");
    }

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontKit);

    // Путь к шрифту
    const fontPath = path.join(process.cwd(), "public/font/DejaVuSans.ttf");
    const fontBoldPath = path.join(
      process.cwd(),
      "public/font/DejaVuSans-Bold.ttf"
    );

    // Чтение шрифтов
    const DejaVuSans = fs.readFileSync(fontPath);
    const DejaVuSansBold = fs.readFileSync(fontBoldPath);
    const FontReg = await pdfDoc.embedFont(DejaVuSans, {
      subset: true,
    });
    const FontBold = await pdfDoc.embedFont(DejaVuSansBold, {
      subset: true,
    });

    // Получаем первую страницу
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const { height, width } = page.getSize();
    console.log(height, width);

    // Добавляем текст с кастомным шрифтом
    const addText = (text, x, y, size = 12, font = FontBold) => {
      if (x === "center") {
        const textWidth = font.widthOfTextAtSize(text, size);
        console.log(text, textWidth);

        const centeredX = 50 + width / 2 - textWidth / 2;
        x = centeredX;
      }
      console.log("text", text);

      page.drawText(`${String(text)}`, {
        x,
        y,
        size,
        color: rgb(0, 0, 0),
        font,
      });
    };

    // ФИО студента
    addText(
      `${studentCourse.student.fullName}`.toUpperCase(),
      TEMPLATE_COORDINATES.fullName.x,
      TEMPLATE_COORDINATES.fullName.y,
      18
    );

    // Название курса
    addText(
      `${studentCourse.course.name} haqida`,
      TEMPLATE_COORDINATES.courseName.x,
      TEMPLATE_COORDINATES.courseName.y,
      18
    );

    // Серийный номер сертификата
    const course = await Course.findById(studentCourse.course);
    const certificateNumber = cerNum;
    const certificateSeries = `${course.prefix} ${certificateNumber}`;
    addText(
      certificateSeries,
      TEMPLATE_COORDINATES.certificateSeries.x,
      TEMPLATE_COORDINATES.certificateSeries.y,
      13
    );

    // Номер сертификата
    addText(
      certificateNumber,
      TEMPLATE_COORDINATES.certificateNumber.x,
      TEMPLATE_COORDINATES.certificateNumber.y,
      10,
      FontReg
    );
    // Описание
    message.split("\n").forEach((line, index) => {
      addText(
        line,
        TEMPLATE_COORDINATES.description.x,
        TEMPLATE_COORDINATES.description.y - 30 * index,
        16
      );
    });
    // Дата выдачи
    addText(
      date,
      TEMPLATE_COORDINATES.date.x,
      TEMPLATE_COORDINATES.date.y,
      11,
      FontReg
    );
    // Генерация QR-кода
    const qrUrl = `${process.env.NEXTAUTH_URL}/certificates/${certificateSeries
      .replaceAll(" ", "")
      .replaceAll("№", "")}.pdf`;
    const qrImage = await QRCode.toBuffer(qrUrl);
    const embeddedQr = await pdfDoc.embedPng(qrImage);
    page.drawImage(embeddedQr, {
      x: TEMPLATE_COORDINATES.qrCode.x,
      y: TEMPLATE_COORDINATES.qrCode.y,
      width: TEMPLATE_COORDINATES.qrCode.size,
      height: TEMPLATE_COORDINATES.qrCode.size,
    });

    // Сохранение PDF
    const pdfBytes = await pdfDoc.save();
    const outputDir = path.join(process.cwd(), "public/certificates");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(
      outputDir,
      `${certificateSeries.replaceAll(" ", "").replaceAll("№", "")}.pdf`
    );
    fs.writeFileSync(outputPath, pdfBytes);

    // Обновление записи в БД
    studentCourse.certificateNumber = certificateSeries;
    studentCourse.certificateUrl = `/certificates/${certificateSeries
      .replaceAll(" ", "")
      .replaceAll("№", "")}.pdf`;
    await studentCourse.save();

    return NextResponse.json({
      success: true,
      certificateUrl: `/certificates/${certificateSeries
        .replaceAll(" ", "")
        .replaceAll("№", "")}.pdf`,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errorCode: "CERT_GEN_ERROR",
      },
      { status: 500 }
    );
  }
}
