import { NextResponse } from "next/server";
import connectMongoDb from "../../../../lib/mongodb";
import { StudentCourse } from "../../../../models";

// app/api/student-courses/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");

  await connectMongoDb();

  if (filter === "all") {
    const data = await StudentCourse.find()
      .populate("student")
      .populate("course");
    return NextResponse.json({ success: true, data });
  }
  const data = await StudentCourse.find({ examResult: true, certificateUrl: null })
    .populate("student")
    .populate("course");
  return NextResponse.json({ success: true, data });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, message: "Kurs topilmadi!" }, { status: 400 });
  }
  await connectMongoDb();

  const deletedData = await StudentCourse.findByIdAndDelete(id);

  if (!deletedData) {
    return NextResponse.json({ success: false, message: "Kurs topilmadi!" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Данные удалены" });
}