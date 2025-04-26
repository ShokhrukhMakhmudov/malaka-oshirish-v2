"use server";

import { NextResponse } from "next/server";
import connectMongoDb from "../../../../lib/mongodb";
import { StudentCourse } from "../../../../models";
import fs from "fs";
import path from "path";
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  await connectMongoDb();

  try {
    const certificates = await StudentCourse.find({ student: owner })
      .populate("student")
      .populate("course");
    return new Response(JSON.stringify(certificates), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Kurs topilmadi!" },
      { status: 400 }
    );
  }

  await connectMongoDb();

  const data = await StudentCourse.findById(id);

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Kurs topilmadi!" },
      { status: 404 }
    );
  }

  // Удаление файла, если он существует
  if (data.certificateUrl) {
    const filePath = path.join(process.cwd(), "public", data.certificateUrl);

    try {
      fs.unlinkSync(filePath); // Удаляем файл синхронно
    } catch (err) {
      console.error("Xatolik faylni o'chirishda:", err.message);
      return NextResponse.json(
        { success: false, message: "Xatolik faylni o'chirishda!" },
        { status: 500 }
      );
      // Можно продолжить, даже если файл не найден
    }
  }

  await StudentCourse.findByIdAndDelete(id);

  return NextResponse.json({ success: true, message: "Данные удалены" });
}
