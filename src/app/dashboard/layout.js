"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../../components/Loader";

const RootLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            localStorage.removeItem("token");
            router.push("/login");
          } else {
            setUserData(data);
            setIsLoading(false);
          }
        });
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="adminPage">
      <header className="w-full   header bg-foreground text-background font-montMed shadow-lg border-b-2 border-white">
        <div className="container py-4 flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between">
          <Link href="/dashboard" className="logo flex items-center gap-3">
            <img src="/iiv.png" alt="logo" width={60} height={60} />
            <p className="font-semibold text-primary">
              ICHKI ISHLAR VAZIRLIGI <br /> MALAKA OSHIRISH INSTITUTI
            </p>
          </Link>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-outline m-1">
                Tinglovchilar
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-52 p-4 shadow flex flex-col gap-2">
                <li>
                  <Link href="/dashboard/students" className="btn btn-outline">
                    Tinglovchilar ro'yxati
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/students/create"
                    className="btn btn-outline">
                    Tinglovchi qo'shish
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/upload" className="btn btn-outline">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      height="20px"
                      width="20px"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.85858 2.87732L15.4293 1.0815C15.7027 1.04245 15.9559 1.2324 15.995 1.50577C15.9983 1.52919 16 1.55282 16 1.57648V22.4235C16 22.6996 15.7761 22.9235 15.5 22.9235C15.4763 22.9235 15.4527 22.9218 15.4293 22.9184L2.85858 21.1226C2.36593 21.0522 2 20.6303 2 20.1327V3.86727C2 3.36962 2.36593 2.9477 2.85858 2.87732ZM4 4.73457V19.2654L14 20.694V3.30599L4 4.73457ZM17 19H20V4.99997H17V2.99997H21C21.5523 2.99997 22 3.44769 22 3.99997V20C22 20.5523 21.5523 21 21 21H17V19ZM10.2 12L13 16H10.6L9 13.7143L7.39999 16H5L7.8 12L5 7.99997H7.39999L9 10.2857L10.6 7.99997H13L10.2 12Z" />
                    </svg>
                    Fayl yuklash
                  </Link>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-outline m-1">
                Sertifikatlar
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-52 p-4 shadow flex flex-col gap-2">
                <li>
                  <Link
                    href="/dashboard/certificates"
                    className="btn btn-outline">
                    Sertifikatlar ro'yxati
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/certificates/create"
                    className="btn btn-outline">
                    Sertifikat yaratish
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/certificates/add"
                    className="btn btn-outline">
                    Sertifikat yuklash
                  </Link>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-outline m-1">
                Kurslar
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-52 p-4 shadow flex flex-col gap-2">
                <li>
                  <Link href="/dashboard/courses" className="btn btn-outline">
                    Mavjud kurslar ro'yxati
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/courses/results"
                    className="btn btn-outline">
                    Kurs natijalari
                  </Link>
                </li>
              </ul>
            </div>

            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                className="theme-controller"
                value="light"
              />

              {/* sun icon */}
              <svg
                className="swap-off h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
              <svg
                className="swap-on h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
            {/* <Link href="/dashboard/addgraduate" className="btn btn-outline">
              Bitiruvchi qo'shish
            </Link>
            <Link href="/dashboard/addsertificate" className="btn btn-outline">
              Sertifikat qo'shish
            </Link> */}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
