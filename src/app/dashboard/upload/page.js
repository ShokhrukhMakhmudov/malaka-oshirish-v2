"use client"; // Указываем, что это клиентский компонент
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";

function UploadPage() {
  const [courses, setCourses] = useState([]); // Состояние для хранения списка курсов
  const [selectedCourse, setSelectedCourse] = useState(""); // Выбранный курс
  const [file, setFile] = useState(null); // Выбранный файл
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  const router = useRouter();

  // Загрузка списка курсов при монтировании компонента
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
      }
    };

    fetchCourses();
  }, []);

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !file) {
      setError("Пожалуйста, выберите курс и файл");
      return;
    }

    // Проверка формата файла
    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isValidFile = allowedExtensions.includes(`.${fileExtension}`);

    if (!isValidFile) {
      setError("Пожалуйста, загрузите файл в формате Excel (.xlsx или .xls)");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Ma'lumotlar muvaffaqiyatli yuklandi!");

        router.push("/dashboard/courses/results");
      } else {
        setError(result.message || "Ошибка при загрузке файла");
      }
    } catch (error) {
      setError("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="container mt-10">
      <h1 className="text-3xl font-bold mb-5 text-center">Fayl yuklash</h1>

      <form onSubmit={handleSubmit} className="max-w-[500px] mx-auto">
        {/* Выбор курса */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Kursni tanlang</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required>
            <option value="" disabled>
              Kursni tanlang
            </option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.prefix})
              </option>
            ))}
          </select>
        </div>

        {/* Выбор файла */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Excel faylni tanlang</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Сообщение об ошибке */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Кнопка отправки */}
        <button
          type="submit"
          className="btn btn-outline w-full"
          disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Yuklash"}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
