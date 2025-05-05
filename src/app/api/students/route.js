import { NextResponse } from "next/server";
import connectMongoDb from "../../../../lib/mongodb";
import { Student, StudentCourse } from "../../../../models";

export async function POST(req, res) {
  await connectMongoDb();

  const { name, rank, passport, jshir, photo, courseId } = await req.json(); // используйте req.json() для получения данных в Next.js API роуте

  if (!courseId) {
    return NextResponse.json(
      { success: false, message: "Kurs topilmadi" },
      { status: 400 }
    );
  }
  let student = await Student.findOne({
    passportSeries: passport,
    jshir,
  });

  if (student) {
    return NextResponse.json(
      { success: false, message: "Tinglovchi ma'lumotlar mavjud" },
      { status: 400 }
    );
  }
  try {
    // Создание и сохранение нового выпускника
    const graduate = new Student({
      fullName: name,
      rank,
      passportSeries: passport.toUpperCase().trim(),
      jshir: jshir.toUpperCase().trim(),
      photo,
    });

    const savedGraduate = await graduate.save();

    // Создание и сохранение связи между выпускником и курсом
    const studentCourse = new StudentCourse({
      student: savedGraduate._id,
      course: courseId,
    });

    await studentCourse.save();

    return new Response(
      JSON.stringify({ success: true, graduate: savedGraduate }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}

export async function PUT(req, res) {
  await connectMongoDb();

  const { fullName, passport, jshir, photo, id, rank } = await req.json();

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        fullName: fullName?.trim(),
        passport: passport?.toUpperCase(),
        jshir: jshir,
        photo,
        rank,
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return new Response(
        JSON.stringify({ success: false, message: "Bitiruvchi topilmadi" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, student: updatedStudent }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const courseId = searchParams.get("courseId");
  const search = searchParams.get("search");

  await connectMongoDb();

  try {
    if (id) {
      const students = await Student.find({ _id: id });
      return NextResponse.json(students, {
        status: 200,
      });
    }

    if (courseId) {
      // Получаем данные и сортируем по дате создания (новые сверху)
      const query = courseId === "all" ? {} : { course: courseId };
      const data = await StudentCourse.find(query)
        .sort({ createdAt: -1 })
        .populate("student")
        .populate("course");

      // Группируем данные по дате создания
      const groupedData = data.reduce((acc, item) => {
        const dateKey = new Date(item.createdAt).toISOString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push({
          ...item.toObject(), // Конвертируем Mongoose Document в обычный объект
          student: item.student.toObject(),
          course: item.course.toObject(),
        });
        return acc;
      }, {});

      return NextResponse.json({ success: true, data: groupedData });
    }

    if (search) {
      // Поиск выпускников по имени
      const searchRegex = new RegExp(search, "i");
      const query =
        search === "all" ? {} : { fullName: { $regex: searchRegex } };
      const students = await Student.find(query).populate({
        path: "courses",
        populate: {
          path: "course", // Дополнительная популяция данных курса
          model: "Course",
        },
      });

      return NextResponse.json({ data: students }, { status: 200 });
    }

    const students = await StudentCourse.find()
      .populate("student")
      .populate("course")
      .exec();
    // Получаем всех выпускников из базы данных
    return new Response(JSON.stringify({ success: true, data: students }), {
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

  await connectMongoDb();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Ma'lumot topilmadi" },
      { status: 400 }
    );
  }

  try {
    // Удаляем все связанные курсы студента
    await StudentCourse.deleteMany({ student: id });

    // Удаляем самого студента
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { success: false, message: "Student topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student va uning kurslari o'chirildi",
        deletedCount: {
          student: 1,
          courses: await StudentCourse.countDocuments({ student: id }), // Для проверки
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errorCode: "DELETE_STUDENT_ERROR",
      },
      { status: 500 }
    );
  }
}
