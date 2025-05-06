import { NextResponse } from "next/server";
import { Course } from "../../../../models";
import connectMongoDb from "../../../../lib/mongodb";

// Подключение к базе данных
await connectMongoDb();

// POST-запрос для создания курса
export async function POST(request) {
  try {
    // Получаем данные из тела запроса
    const { name, prefix } = await request.json();

    // Проверяем, что все обязательные поля заполнены
    if (!name || !prefix) {
      return NextResponse.json(
        { success: false, message: "Название и префикс курса обязательны" },
        { status: 400 }
      );
    }

    // Создаем новый курс
    const newCourse = new Course({ name, prefix });
    await newCourse.save();

    // Возвращаем успешный ответ
    return NextResponse.json(
      { success: true, message: "Курс успешно создан" },
      { status: 201 }
    );
  } catch (error) {
    // Обработка ошибок
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Обработка других HTTP-методов (GET, PUT, DELETE и т.д.)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const courses = await Course.findById(id);
    return new Response(JSON.stringify(courses));
  }
  try {
    const courses = await Course.find();
    return new Response(JSON.stringify(courses), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  await connectMongoDb();

  try {
    // Получаем данные из тела запроса
    const { name, prefix, id } = await req.json();

    // Проверяем, что все обязательные поля заполнены
    if (!name || !prefix) {
      return NextResponse.json(
        { success: false, message: "Название и префикс курса обязательны" },
        { status: 400 }
      );
    }

    // Создаем новый курс
    const newCourse = await Course.findByIdAndUpdate(id, { name, prefix });

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        message: "Kurs muvaffaqiyatli o'zgartirildi!",
        data: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    // Обработка ошибок
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await Course.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
