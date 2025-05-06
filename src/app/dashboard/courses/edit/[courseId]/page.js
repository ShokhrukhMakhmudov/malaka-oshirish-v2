"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../../../components/Loader";

export default function EditCourse({ params: { courseId } }) {
  const [formData, setFormData] = useState({
    name: "", // Название курса
    prefix: "", // Префикс курса
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses?id=${courseId}`);
        const course = await response.json();
        setFormData({
          name: course.name,
          prefix: course.prefix,
        });
      } catch (error) {
        setError("Malumotlarni olishda xatolik yuz berdi.");
      }
    };
    fetchCourse();
  }, [courseId]);

  // Обработчик изменения значений полей формы
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Kurs muvaffaqiyatli o'zgartirildi!");
        router.push("/dashboard/courses");
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold mb-5 text-center">Kurs Tahrirlash</h1>

      <form className="card-body max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Kurs nomi</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Misol: Malaka oshirish"
            className="input input-bordered text-xl w-full"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="label">
            <span className="label-text text-lg">Kurs prefiksi</span>
          </label>
          <input
            type="text"
            name="prefix"
            placeholder="Misol: MO"
            className="input input-bordered text-xl w-full"
            value={formData.prefix}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="form-control mt-6">
          <button className="btn btn-primary text-primary-content text-lg">
            O'zgartirish
          </button>
        </div>
      </form>

      {loading && <Loader />}
    </div>
  );
}
