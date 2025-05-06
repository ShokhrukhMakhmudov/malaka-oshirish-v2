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
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date().getDate());
  const [certificateUrl, setCertificateUrl] = useState("");
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

  const generateCertificate = async () => {
    setLoading(true);
    if (!selectedId || !message || !date) {
      setError({ message: "Barcha maydonlarni to'ldiring!", show: true });
      setTimeout(() => setError({ message: "", show: false }), 3000);
      return;
    }
    try {
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentCourseId: selectedId,
          message,
          date: date.split("-").reverse().join("."),
          certificateNumber,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setCertificateUrl(result.certificateUrl);
        setStudents((prev) => prev.filter((sc) => sc._id !== selectedId));
        setSelectedId("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectId = (data) => {
    setSelectedId(data._id);

    if (data?.certificateNumber) {
      setCertificateNumber(data.certificateNumber);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sertifikat yaratish</h1>

      <SearchableSelect
        students={students}
        setSelectedId={handleSelectId}
        selectedId={selectedId}
      />

      <label
        htmlFor="certificateNumber"
        className="block text-lg font-bold mb-2">
        Sertifikat raqami:
      </label>
      <input
        type="text"
        name="certificateNumber"
        id="certificateNumber"
        value={certificateNumber}
        onChange={(e) => setCertificateNumber(e.target.value)}
        className="input input-bordered w-full mb-4"
        placeholder="Misol: 123456"
      />
      <label htmlFor="date" className="block text-lg font-bold mb-2">
        Sana:
      </label>
      <input
        className="border-2 border-gray-500 rounded-lg p-2 w-full bg-transparent mb-2"
        type="date"
        name="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        format="yyyy-MM-dd"
      />

      <label htmlFor="message" className="block text-lg font-bold mb-2">
        Matn:
      </label>
      <textarea
        name="message"
        rows={10}
        id="message"
        className="border-2 border-gray-500 rounded-lg p-2 w-full bg-transparent mb-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}></textarea>
      {error.show && <p className="text-red-500">{error.message}</p>}
      <button
        className="btn text-lg btn-outline mb-6"
        onClick={generateCertificate}
        disabled={!selectedId || !message || !date || loading}>
        {loading ? "Generatsiya..." : "Sertifikat yaratish"}
      </button>

      {certificateUrl && (
        <div className="border-white border-2 p-4 rounded-lg shadow-md flex items-center justify-between">
          <h2 className="text-2xl font-bold ">Sertifikat yaratildi:</h2>

          <a href={certificateUrl} target="_blank" className="btn btn-outline">
            PDF faylni yuklab olish
          </a>
        </div>
      )}

      {loading && <Loader />}
    </div>
  );
}
