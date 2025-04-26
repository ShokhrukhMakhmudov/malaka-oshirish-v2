import Link from "next/link";
import { useRef, useState, memo } from "react";

const StudentList = memo(({ students }) => {
  const search = useRef(null);
  const [sort, setSort] = useState("all");
  const [filteredGraduates, setFilteredGraduates] = useState(null);
  const [graduates, setGraduates] = useState(students);
  console.log(students);

  function sortData(type) {
    console.log(type);

    if (type === "all") {
      setSort("all");
      setFilteredGraduates(null);
      return;
    } else if (type === "date") {
      if (filteredGraduates) {
        const sorted = filteredGraduates.sort((a, b) => {
          return new Date(a.graduationDate) - new Date(b.graduationDate);
        });
        setFilteredGraduates(sorted);
        setSort("date");
      } else {
        setGraduates((old) =>
          old.sort((a, b) => {
            return new Date(a.graduationDate) - new Date(b.graduationDate);
          })
        );
        setSort("date");
      }
    } else if (type === "name") {
      if (filteredGraduates) {
        const sorted = filteredGraduates.sort((a, b) => {
          return a.lastname.localeCompare(b.lastname);
        });
        setFilteredGraduates(sorted);
        setSort("name");
      } else {
        const sorted = [...graduates].sort((a, b) => {
          return a.lastname
            .toLowerCase()
            .localeCompare(b.lastname.toLowerCase());
        });
        setFilteredGraduates(sorted);

        setSort("name");
      }
    }
  }
  function showPhoto(photoPath) {
    document.getElementById("modalPhoto").showModal();
    document.getElementById("modalImg").src = photoPath;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const searchText = search.current.value.toLowerCase();

    const filtered = graduates.filter((graduate) => {
      const fullname =
        graduate.name + " " + graduate?.lastname + " " + graduate?.surname;

      return fullname.toLowerCase().includes(searchText);
    });

    setFilteredGraduates(filtered);
  }
  return (
    <>
      <div className="mb-5 px-2 sm:px-0">
        <form className="flex justify-between gap-5" onSubmit={handleSubmit}>
          <label className="w-full input input-bordered flex items-center gap-2">
            <input
              ref={search}
              id="search"
              type="text"
              className="grow"
              placeholder="Bitiruvchini izlash..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <button className="btn btn-outline" type="submit">
            Qidirish
          </button>
        </form>
      </div>
      <div>
        <table className="table w-full text-xl">
          {/* head */}
          <thead>
            <tr className="text-lg">
              <th></th>
              <th>
                <label
                  htmlFor="name"
                  className={
                    (sort === "name" ? "btn-outline " : "") +
                    "select-none cursor-pointer btn"
                  }>
                  Ism
                </label>
                <input
                  id="name"
                  name="sort"
                  type="checkbox"
                  className="appearance-none"
                  onChange={(e) =>
                    e.target.checked ? sortData("name") : sortData("all")
                  }
                />
              </th>
              <th>Unvoni</th>
              <th className="text-center">
                <label
                  htmlFor="date"
                  className={
                    (sort === "date" ? "btn-outline " : "") +
                    "select-none cursor-pointer btn"
                  }>
                  Rasm
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {graduates &&
              graduates.map((graduate, index) => (
                <tr key={graduate?._id}>
                  <th>{index + 1}</th>
                  <td>
                    <Link
                      className="hover:underline"
                      href={`dashboard/students/edit/${graduate?._id}`}>
                      {graduate?.fullName}
                    </Link>
                  </td>
                  <td>{graduate?.rank}</td>
                  <td className="text-center">
                    {graduate?.photo ? (
                      <div
                        className="relative w-fit h-fit mx-auto rounded-xl overflow-hidden"
                        onMouseEnter={(e) => {
                          if (e.target.parentElement.children[1])
                            e.target.parentElement.children[1].style.display =
                              "flex";
                        }}
                        onMouseLeave={(e) => {
                          if (e.target.parentElement.children[1])
                            e.target.parentElement.children[1].style.display =
                              "none";
                        }}>
                        <img
                          className="h-[135px] w-[105px] object-cover object-center "
                          src={graduate.photo}
                          alt="graduate photo"
                        />
                        <span
                          className="absolute top-0 right-0 w-full h-full flex  items-center justify-center bg-[#00000075] backdrop-blur-sm cursor-pointer"
                          style={{ display: "none" }}
                          onClick={() => showPhoto(graduate.photo)}>
                          <svg
                            stroke="#fff"
                            fill="#fff"
                            strokeWidth="0"
                            viewBox="0 0 512 512"
                            height="25px"
                            width="25px"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="256" cy="256" r="64"></circle>
                            <path d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 252 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76zM256 352a96 96 0 1 1 96-96 96.11 96.11 0 0 1-96 96z"></path>
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <svg
                        className="mx-auto"
                        stroke="#eee"
                        fill="#eee"
                        strokeWidth="0"
                        viewBox="0 0 448 512"
                        height="120px"
                        width="90px"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"></path>
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
export default StudentList;
