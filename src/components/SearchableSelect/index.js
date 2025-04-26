"use client";
import { useState, useEffect, useRef } from "react";

export default function SearchableSelect({
  students,
  selectedId,
  setSelectedId,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Фильтрация студентов
  const filteredStudents = students.filter((sc) =>
    `${sc.student.fullName} ${sc.course.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Обработчик клика вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Получение выбранного значения
  const selectedStudent = students.find((sc) => sc._id === selectedId);

  return (
    <div className="mb-6 relative" ref={wrapperRef}>
      <div
        className="select select-bordered w-full flex items-center text-xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}>
        {selectedStudent
          ? `${selectedStudent.student.fullName} - ${selectedStudent.course.name}`
          : "Tinglovchini tanlang"}
      </div>

      {isOpen && (
        <div className="absolute z-10 backdrop-blur-lg w-full mt-2 border rounded-lg shadow-lg">
          {/* Поле поиска */}
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full p-2 border-b text-xl focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          {/* Список опций */}
          <div className="max-h-60 overflow-y-auto">
            {filteredStudents.map((sc) => (
              <div
                key={sc._id}
                className={`p-3 text-xl hover:bg-gray-100 hover:text-black cursor-pointer ${
                  selectedId === sc._id ? "bg-blue-50 text-black" : ""
                }`}
                onClick={() => {
                  setSelectedId(sc);
                  setIsOpen(false);
                  setSearchTerm("");
                }}>
                {sc.student.fullName} - {sc.course.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
