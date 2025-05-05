"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../../components/Loader";
import ImageInput from "../../../../components/ImageInput";

export default function AddGraduate() {
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    passport: "",
    jshir: "",
    photo: "",
    courseId: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const router = useRouter();

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
  // Обработчик изменения значений полей формы
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpload = async () => {
    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploadphoto", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        return data.path;
      } else {
        setError(data.error || "Ошибка при загрузке файла.");
      }
    } catch (error) {
      setError("Ошибка сети или сервера.");
    }
  };
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const photoPath = await handleUpload();

    if (photoPath) {
      formData.photo = photoPath;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Bitiruvchi muvaffaqiyatli qo'shildi!");
        router.push("/dashboard");
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
      <h1 className="text-4xl font-bold mb-5 text-center">
        Bitiruvchi qo'shish
      </h1>

      <form className="card-body max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          <div className="flex sm:flex-row flex-col items-center gap-10">
            <ImageInput setFile={setFile} />
            <div className="w-full">
              <label className="label">
                <span className="label-text text-lg">Ism</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ism"
                className="w-full input input-bordered text-xl"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label className="label">
                <span className="label-text text-lg">
                  Pasport seriya va raqami
                </span>
              </label>
              <input
                type="text"
                name="passport"
                className="input input-bordered text-xl w-full"
                value={formData.passport}
                onChange={handleChange}
                placeholder="AA 1234567"
                maxLength={9}
                minLength={9}
                pattern="[A-Z]{2}[0-9]{7}"
                title="Pasport seriyasi 2 harf va 7 raqam bo'lishi kerak. Masalan: AA1234567"
                required
              />
              <label className="label">
                <span className="label-text text-lg">JSHIR</span>
              </label>
              <input
                name="jshir"
                type="text"
                placeholder="14 ta raqam"
                maxLength={14}
                minLength={14}
                regex="[0-9]{14}"
                pattern="[0-9]{14}"
                title="JSHIR 14 raqam bo'lishi kerak"
                className="input input-bordered text-xl w-full"
                value={formData.jshir}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-lg">Unvoni</span>
          </label>
          <input
            type="text"
            name="rank"
            placeholder="Misol: Mayor"
            className="w-full input input-bordered text-xl"
            value={formData.rank}
            onChange={handleChange}
            required
          />
          <label className="label">
            <span className="label-text">Kursni tanlang</span>
          </label>
          <select
            className="select select-bordered w-full text-xl"
            value={formData.courseId}
            name="courseId"
            onChange={handleChange}
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="form-control mt-6">
          <button className="btn btn-primary text-primary-content text-lg">
            Qo'shish
          </button>
        </div>
      </form>
      {loading && <Loader />}
    </div>
  );
}
