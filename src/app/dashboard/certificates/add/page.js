// app/dashboard/certificates/page.jsx
"use client";
import { useEffect, useState } from "react";
import Loader from "../../../../components/Loader";
import SearchableSelect from "../../../../components/SearchableSelect";

export default function CertificateGenerator() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState({
    message: "",
    show: false,
  });
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/student-courses?populate=student,course");
      const { data } = await res.json();
      setStudents(data);
    };
    fetchData();
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async () => {

    if (!selectedId || !file || !certificateNumber) {
      setError("Iltimos barcha maydonlarni to'ldiring!");
      return;
    }

    // Проверка формата файла
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isValidFile = allowedExtensions.includes(`.${fileExtension}`);

    if (!isValidFile) {
      setError("Iltimos PDF, PNG, JPG yoki JPEG formatida fayl yuklang!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("studentId", selectedId);
    formData.append("certificateNumber", certificateNumber);
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/certificate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Ma'lumotlar muvaffaqiyatli yuklandi!");
      } else {
        setError({
          message: "Xatolik: " + result.message,
          show: true,
        });
      }
    } catch (error) {
      console.log(error)
      setError({
        message: "Malumotlarni saqlashda xatolik yuz berdi.",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sertifikat qo'shish</h1>

      <SearchableSelect students={students} setSelectedId={setSelectedId} selectedId={selectedId} />

      <label htmlFor="certificateNumber" className="block text-lg font-bold mb-2">Sertifikat raqami:</label>
      <input type="text" name="certificateNumber" id="certificateNumber" value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} className="input input-bordered w-full mb-4" placeholder="Misol: MO-123456" />

      <label htmlFor="file" className="block text-lg font-bold mb-2">
        Sertifikat faylni tanlang
      </label>
      <input
        id="file"
        type="file"
        className="file-input file-input-bordered w-full mb-4"
        accept=".pdf, .png, .jpg, .jpeg"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      {error?.show && <p className="text-red-500 mb-4">{error.message}</p>}
      <button
        className="btn text-lg btn-outline mb-6"
        onClick={handleSubmit}
        disabled={!selectedId || !certificateNumber || !file || loading}>
        Sertifikat yaratish
      </button>


      {loading && <Loader />}
    </div>
  );
}

