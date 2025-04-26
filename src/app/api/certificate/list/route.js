"use server";

import { NextResponse } from "next/server";
import connectMongoDb from "../../../../../lib/mongodb";
import { StudentCourse } from "../../../../../models";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  await connectMongoDb();

  try {
    if (search === "all" || !search) {
      const certificates = await StudentCourse.find({
        certificateNumber: { $ne: null },
        certificateUrl: { $ne: null },
      })
        .populate("student")
        .populate("course");
      return NextResponse.json(certificates, {
        status: 200,
      });
    }
    const searchRegex = new RegExp(search, "i");
    const certificates = await StudentCourse.find({
      certificateNumber: { $regex: searchRegex },
      certificateUrl: { $ne: null },
    })
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
