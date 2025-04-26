// app/api/results/route.js
import { NextResponse } from "next/server";
import connectMongoDb from "../../../../lib/mongodb";
import { StudentCourse } from "../../../../models";

export async function PATCH(request) {
  await connectMongoDb();

  try {
    const { studentCourseId, examResult } = await request.json();

    await StudentCourse.findByIdAndUpdate(studentCourseId, { examResult });

    return NextResponse.json({
      success: true,
      message: "Результат обновлен",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
