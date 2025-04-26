"use client";
import { useEffect, useState, useMemo } from "react";
import Loader from "../../components/Loader";
import { BarChart, PieChart } from "../../components/Charts"; // Предполагается наличие компонентов графиков

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes, studentCoursesRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/courses"),
          fetch("/api/student-courses?filter=all"),
        ]);

        const studentsData = await studentsRes.json();
        const coursesData = await coursesRes.json();
        const studentCoursesData = await studentCoursesRes.json();

        setStudents(studentsData.data);
        setCourses(coursesData);
        setStudentCourses(studentCoursesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Расчет статистики
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalCourses = studentCourses.length;
    const completedCourses = studentCourses.filter(
      (sc) => sc.examResult
    ).length;
    const successRate =
      totalCourses > 0
        ? ((completedCourses / studentCourses.length) * 100).toFixed(1)
        : 0;

    // Распределение по курсам
    const courseDistribution = courses.reduce((acc, course) => {
      const count = studentCourses.filter(
        (sc) => sc.course?._id === course._id
      ).length;
      acc[course.name] = count;
      return acc;
    }, {});

    return {
      totalStudents,
      totalCourses,
      completedCourses,
      successRate,
      courseDistribution,
    };
  }, [students, courses, studentCourses]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        O'quv statistikasi
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Jami o'quvchilar"
          value={stats.totalStudents}
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 1024 1024"
              height="50px"
              width="50px"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M746 835.28L544.529 723.678c74.88-58.912 95.216-174.688 95.216-239.601v-135.12c0-89.472-118.88-189.12-238.288-189.12-119.376 0-241.408 99.664-241.408 189.12v135.12c0 59.024 24.975 178.433 100.624 239.089L54 835.278S0 859.342 0 889.342v81.088c0 29.84 24.223 54.064 54 54.064h692c29.807 0 54.031-24.224 54.031-54.064v-81.087c0-31.808-54.032-54.064-54.032-54.064zm-9.967 125.215H64.002V903.28c4.592-3.343 11.008-7.216 16.064-9.536 1.503-.688 3.007-1.408 4.431-2.224l206.688-112.096c18.848-10.224 31.344-29.184 33.248-50.528s-7.008-42.256-23.712-55.664c-53.664-43.024-76.656-138.32-76.656-189.152V348.96c0-45.968 86.656-125.12 177.408-125.12 92.432 0 174.288 78.065 174.288 125.12v135.12c0 50.128-15.568 145.84-70.784 189.28a64.098 64.098 0 0 0-24.224 55.664 64.104 64.104 0 0 0 33.12 50.849l201.472 111.6c1.777.975 4.033 2.031 5.905 2.848 4.72 2 10.527 5.343 14.783 8.288v57.887zM969.97 675.936L765.505 564.335c74.88-58.912 98.224-174.688 98.224-239.601v-135.12c0-89.472-121.872-190.128-241.28-190.128-77.6 0-156.943 42.192-203.12 96.225 26.337 1.631 55.377 1.664 80.465 9.664 33.711-26.256 76.368-41.872 122.656-41.872 92.431 0 177.278 79.055 177.278 126.128v135.12c0 50.127-18.56 145.84-73.775 189.28a64.098 64.098 0 0 0-24.224 55.664 64.104 64.104 0 0 0 33.12 50.848l204.465 111.6c1.776.976 4.032 2.032 5.904 2.848 4.72 2 10.527 5.344 14.783 8.288v56.912H830.817c19.504 14.72 25.408 35.776 32.977 64h106.192c29.807 0 54.03-24.224 54.03-54.064V730.03c-.015-31.84-54.047-54.096-54.047-54.096z" />
            </svg>
          }
        />
        <StatCard
          title="Yakunlagan kurslar"
          value={stats.completedCourses}
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 448 512"
              height="50px"
              width="50px"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M219.3 .5c3.1-.6 6.3-.6 9.4 0l200 40C439.9 42.7 448 52.6 448 64s-8.1 21.3-19.3 23.5L352 102.9l0 57.1c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-57.1L48 93.3l0 65.1 15.7 78.4c.9 4.7-.3 9.6-3.3 13.3s-7.6 5.9-12.4 5.9l-32 0c-4.8 0-9.3-2.1-12.4-5.9s-4.3-8.6-3.3-13.3L16 158.4l0-71.8C6.5 83.3 0 74.3 0 64C0 52.6 8.1 42.7 19.3 40.5l200-40zM111.9 327.7c10.5-3.4 21.8 .4 29.4 8.5l71 75.5c6.3 6.7 17 6.7 23.3 0l71-75.5c7.6-8.1 18.9-11.9 29.4-8.5C401 348.6 448 409.4 448 481.3c0 17-13.8 30.7-30.7 30.7L30.7 512C13.8 512 0 498.2 0 481.3c0-71.9 47-132.7 111.9-153.6z" />
            </svg>
          }
        />
        <StatCard
          title="Umumiy kurslar"
          value={stats.totalCourses}
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 24 24"
              height="50px"
              width="50px"
              xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
            </svg>
          }
        />
        <StatCard
          title="Muvaffaqiyat foizi"
          value={`${stats.successRate}%`}
          icon={
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="50px"
              width="50px"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16v5" />
              <path d="M16 14v7" />
              <path d="M20 10v11" />
              <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
              <path d="M4 18v3" />
              <path d="M8 14v7" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="shadow-primary p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Kurslar bo'yicha taqsimot</h2>
          <BarChart data={stats.courseDistribution} />
        </div>

        <div className="shadow-primary p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Imtihonlar statistikasi</h2>
          <PieChart
            data={{
              Yakunlangan: stats.completedCourses,
              Yakunlanmagan: studentCourses.length - stats.completedCourses,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Компонент карточки статистики
const StatCard = ({ title, value, icon }) => (
  <div className="shadow-primary p-6 rounded-lg shadow-md flex items-center">
    <div className="text-4xl mr-4">{icon}</div>
    <div>
      <div className=" text-sm">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  </div>
);
