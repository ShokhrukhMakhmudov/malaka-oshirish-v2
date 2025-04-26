// app/dashboard/courses/[courseId]/results/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../../../components/Loader";
import Link from "next/link";

export default function CourseResultsPage() {
  const { courseId } = useParams();
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/students?courseId=all`);
        const { data } = await res.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, refresh]);

  const handleCheckboxChange = async (studentCourseId, checked) => {
    setLoading(true);

    try {
      const req = await fetch("/api/results", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentCourseId,
          examResult: checked,
        }),
      });

      const res = await req.json();

      if (res.success) {
        setRefresh((prev) => !prev);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (studentCourseId) => {
    const result = confirm("Tinglochini kursi o'chirilsinmi?");
    if (!result) return;
    try {
      const response = await fetch("/api/student-courses?id=" + studentCourseId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

      });
      const result = await response.json();
      if (result.success) {
        setRefresh((prev) => !prev);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Natijalarni tahrirlash</h1>

      <div className="overflow-x-auto">
        <table className="table w-full  table-lg">
          <thead>
            <tr className="text-xl">
              <th>To'liq ismi</th>
              <th className="text-center">Kurs nomi</th>
              <th className="text-center">Imtihon holati</th>
              <th className="text-center">Natijani tahrirlash</th>
              <th className="text-end">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {Object?.keys(students).map((key) => {
              return (
                <>
                  <tr className="active w-full">
                    <td className="text-lg">
                      {new Date(key).toLocaleString()}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  {students[key].map((sc) => (
                    <tr key={sc._id}>
                      <td className="text-xl">
                        <Link
                          className="hover:underline"
                          href={`/dashboard/students/edit/${sc.student._id}`}>
                          {sc.student?.fullName}
                        </Link>
                      </td>
                      <td className="text-xl text-center">{sc.course?.name}</td>
                      <td className="text-xl text-center">
                        {sc.examResult ? "✅ O'tdi" : "❌ Yeqildi"}
                      </td>
                      <td className="text-xl text-center">
                        <input
                          type="checkbox"
                          checked={sc.examResult}
                          onChange={(e) =>
                            handleCheckboxChange(sc._id, e.target.checked)
                          }
                          className="checkbox checkbox-primary"
                        />
                      </td>
                      <td className="text-end">
                        <button className="btn btn-outline" onClick={() => handleDelete(sc._id)}>O'chirish</button>
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
