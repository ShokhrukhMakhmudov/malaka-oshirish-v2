// app/dashboard/students/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../../../components/Loader";

export default function StudentsPage() {
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchData = async (search = "") => {
    try {
      setLoading(true);
      const url = search
        ? `/api/certificate/list?search=${search}`
        : "/api/certificate/list?search=all";

      const res = await fetch(url);
      const data = await res.json();
      setCertificates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(searchText);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const confirm = window.confirm("Sertifikat o'chirilsinmi?");
    if (!confirm) return;

    try {
      const response = await fetch(`/api/certificate?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Обновляем список курсов после удаления
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || "Ошибка при удалении курса");
      }
    } catch (error) {
      setError("Ошибка сети или сервера");
    }

    setLoading(false);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sertifikatlar ro'yxati</h1>
        </div>

        {/* Поисковая форма */}
        <form
          className="form-control flex-row items-stretch gap-4"
          onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ism, familiya yoki passport bo'yicha qidirish"
            className="input input-bordered input-lg w-full"
            value={searchText}
            onChange={handleSearchChange}
          />
          <button type="submit" className="btn btn-outline btn-lg">
            Qidirish
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-lg w-full">
            <thead>
              <tr className="text-xl">
                <th>To'liq ismi</th>
                <th className="text-center">Raqami</th>
                <th>Kurslar nomi</th>
                <th className="text-center">Fayl</th>
                <th className="text-end">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {certificates?.length > 0 ? (
                certificates.map((sc) => (
                  <tr key={sc.id}>
                    <td className="text-xl">{sc?.student.fullName}</td>
                    <td className="text-xl text-center">
                      {sc?.certificateNumber}
                    </td>
                    <td className="text-xl">{sc?.course.name}</td>
                    <td className="text-xl text-center">
                      <Link
                        href={sc?.certificateUrl}
                        target="_blank"
                        className="flex justify-center">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="50px"
                          width="50px"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"></path>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"></path>
                        </svg>
                      </Link>
                    </td>
                    <td className="text-xl text-end">
                      <button
                        onClick={() => handleDelete(sc._id)}
                        className="btn btn-outline hover:btn-error">
                        O'chirish
                      </button>

                      {/* <Link
                        href={`/dashboard/courses/${sc.courses[0].course?._id}/results`}
                        className="btn btn-sm btn-primary">
                        Tahrirlash
                      </Link> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-xl">
                    Hech qanday natija topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
