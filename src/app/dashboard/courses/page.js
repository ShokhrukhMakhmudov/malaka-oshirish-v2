"use client"; // Указываем, что это клиентский компонент
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";

function CoursesPage() {
  const [courses, setCourses] = useState([]); // Состояние для хранения списка курсов
  const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для отображения ошибок

  // Загрузка данных о курсах при монтировании компонента
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          setError(data.message || "Ошибка при загрузке курсов");
        }
      } catch (error) {
        setError("Ошибка сети или сервера");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Обработчик удаления курса
  const handleDelete = async (id) => {
    if (confirm("Вы уверены, что хотите удалить этот курс?")) {
      try {
        const response = await fetch(`/api/courses?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Обновляем список курсов после удаления
          setCourses(courses.filter((course) => course._id !== id));
        } else {
          const data = await response.json();
          setError(data.message || "Ошибка при удалении курса");
        }
      } catch (error) {
        setError("Ошибка сети или сервера");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <>
      <div className="container mt-10">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <h2 className="text-3xl font-semibold">Kurslar</h2>
          <Link href="/dashboard/courses/add" className="btn btn-outline">
            Qo'shish
          </Link>
        </div>

        {/* Таблица с курсами */}
        <div className="mt-5 overflow-x-auto">
          <table className="table table-lg w-full text-primary">
            <thead>
              <tr className="text-xl border-primary text-primary">
                <th>№</th>
                <th>Nomi</th>
                <th className="text-center">Prefiksi</th>
                <th className="text-end">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course._id} className="border-primary">
                  <td className="text-xl">{index + 1}</td>
                  <td className="text-xl">{course.name}</td>
                  <td className="text-xl text-center">{course.prefix}</td>
                  <td className="flex justify-end text-xl">
                    <div className="flex gap-2 ">
                      {/* Кнопка редактирования */}
                      <Link
                        href={`/dashboard/courses/edit/${course._id}`}
                        className="btn btn-md text-lg btn-outline text-primary">
                        Tahrirlash
                      </Link>
                      {/* Кнопка удаления */}
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="btn btn-md text-lg btn-outline text-primary">
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CoursesPage;
