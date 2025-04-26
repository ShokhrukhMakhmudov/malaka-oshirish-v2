// app/dashboard/students/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../../../components/Loader";
import debounce from "lodash.debounce"; // Установите пакет: npm install lodash.debounce

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchData = async (search = "") => {
    try {
      setLoading(true);
      const url = search
        ? `/api/students?search=${search}`
        : "/api/students?search=all";

      const res = await fetch(url);
      const { data } = await res.json();
      setStudents(data);
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
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tinglovchilar ro'yxati</h1>
          {/* <Link
            href="/dashboard/courses/results"
            className="btn btn-outline">
            Tahrirlash
          </Link> */}
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
                <th>Kurslar nomi</th>
                <th className="text-center">Imtihon natijasi</th>
                <th className="text-end">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {students?.length > 0 ? (
                students.map((sc) => (
                  <tr key={sc.id}>
                    <td className="text-xl">{sc?.fullName}</td>
                    <td className="text-xl">
                      {sc?.courses?.map((c) => (
                        <p key={c?.course?._id}>
                          {c?.course?.name} ({c?.course?.prefix})
                        </p>
                      ))}
                    </td>
                    <td className="text-xl text-center ">
                      {sc?.courses?.map((c) => (
                        <p key={c?.course?._id}>{c?.examResult ? "✅ O'tdi" : "❌ Yeqildi"}</p>
                      ))}
                    </td>
                    <td className="text-xl text-end">

                      <Link
                        href={`/dashboard/students/edit/${sc._id}`}
                        className="btn btn-outline">
                        Tahrirlash
                      </Link>

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
