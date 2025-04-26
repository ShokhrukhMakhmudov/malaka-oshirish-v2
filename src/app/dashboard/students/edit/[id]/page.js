"use client";
import { useEffect, useState } from "react";
import Loader from "../../../../../components/Loader";
import ImageInput from "../../../../../components/ImageInput";

export default function page({ params }) {
  const studentId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    passportSeries: "",
    jshir: "",
    rank: "",
    photo: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students?id=${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          id: data[0]?._id,
          fullName: data[0]?.fullName,
          passportSeries: data[0]?.passportSeries,
          jshir: data[0]?.jshir,
          photo: data[0]?.photo,
          rank: data[0]?.rank,
        });
        setIsLoading(false);
      });
  }, [studentId]);

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Malumotlar muvaffaqiyatli o'zgartirildi!");
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);
  };

  // 
  const handleDelete = async () => {
    const result = confirm("Tinglovchi o'chirilsinmi?");
    if (!result) return;

    setLoading(true);
    try {
      const response = await fetch("/api/students?id=" + studentId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        alert("Tinglovchi muvaffaqiyatli o'chirildi!");
        window.location.href = "/dashboard/students";
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);

  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold mb-5 text-center">
        Bitiruvchi tahrirlash
      </h1>

      <form className="px-8 py-4 max-w-[700px] mx-auto" onSubmit={handleSubmit}>
        <div className="form-control">
          <div className="flex sm:flex-row flex-col items-center gap-10">
            {!formData.photo && <ImageInput setFile={setFile} />}
            {formData.photo && (
              <div className="relative flex flex-col items-center justify-center rounded-xl min-w-[200px] min-h-[245px]">
                {!file && (
                  <img
                    className="w-[200px] h-[245px] object-cover rounded-xl"
                    width={200}
                    height={245}
                    src={`${formData.photo}`}
                    alt="rasm"
                  />
                )}
                <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 z-10">
                  <ImageInput setFile={setFile} photo={formData.photo} />
                </div>
              </div>
            )}
            <div className="w-full">
              <label className="label">
                <span className="label-text text-lg">To'liq ismi</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Familiya"
                className="input input-bordered text-xl w-full"
                value={formData.fullName}
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
                value={formData.passportSeries}
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
              <label className="label">
                <span className="label-text text-lg">Unvoni</span>
              </label>
              <input
                type="text"
                name="rank"
                placeholder="Unvoni"
                className="input input-bordered text-xl w-full"
                value={formData.rank}
                onChange={handleChange}
                required
              />
              {/* 
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
                <span className="label-text text-lg">Otasining ismi</span>
              </label>
              <input
                type="text"
                name="surname"
                placeholder="Otasining ismi"
                className="input input-bordered text-xl w-full"
                value={formData.surname}
                onChange={handleChange}
                required
              /> */}
            </div>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="form-control mt-6">
          <button className="btn btn-outline text-lg" type="submit">
            O'zgartirish
          </button>
        </div>
      </form>
      <div className="mx-auto max-w-[700px] px-8">
        <button className="btn btn-error text-white text-lg w-full" onClick={handleDelete}>
          Ma'lumotlarni o'chirish
        </button>
      </div>
      {loading && <Loader />}
    </div>
  );
}
