"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Изменить значение, если прокрутка больше 50px
      } else {
        setIsScrolled(false); // Вернуть обратно, если скролл меньше 50px
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Очистка слушателя при размонтировании компонента
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      className={`w-full fixed z-[100] top-0 header text-background font-montMed shadow-lg border-b-2 border-white transition-all duration-300 ${
        isScrolled ? "backdrop-blur-xl" : "bg-transparent"
      }`}>
      <div className="container py-4 flex items-center justify-between px-2 sm:px-0">
        <div className="logo flex items-center gap-3">
          <img
            src="/bg.png"
            alt="logo"
            className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px]"
            width={60}
            height={60}
          />
          <p className="font-semibold text-white text-[12px] sm:text-lg">
            ICHKI ISHLAR VAZIRLIGI <br /> MALAKA OSHIRISH INSTITUTI
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <label className="swap swap-rotate">
            <input type="checkbox" className="theme-controller" value="light" />
            <svg
              className="swap-on h-[30px] w-[30px] fill-color"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>{" "}
            <svg
              className="swap-off h-[30px] w-[30px] fill-[#fff]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label> */}

          <a href="https://t.me/IIVMOI_Uz" target="_blank">
            <svg
              stroke="white"
              fill="white"
              strokeWidth="0"
              viewBox="0 0 32 32"
              className="cursor-pointer w-[25px] h-[25px] sm:w-[30px] sm:h-[30px]"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M26.07 3.996a2.974 2.974 0 00-.933.223h-.004c-.285.113-1.64.683-3.7 1.547l-7.382 3.109c-5.297 2.23-10.504 4.426-10.504 4.426l.062-.024s-.359.118-.734.375a2.03 2.03 0 00-.586.567c-.184.27-.332.683-.277 1.11.09.722.558 1.155.894 1.394.34.242.664.355.664.355h.008l4.883 1.645c.219.703 1.488 4.875 1.793 5.836.18.574.355.933.574 1.207.106.14.23.257.379.351a1.119 1.119 0 00.246.106l-.05-.012c.015.004.027.016.038.02.04.011.067.015.118.023.773.234 1.394-.246 1.394-.246l.035-.028 2.883-2.625 4.832 3.707.11.047c1.007.442 2.027.196 2.566-.238.543-.437.754-.996.754-.996l.035-.09 3.734-19.129c.106-.472.133-.914.016-1.343a1.807 1.807 0 00-.781-1.047 1.872 1.872 0 00-1.067-.27zm-.101 2.05c-.004.063.008.056-.02.177v.011l-3.699 18.93c-.016.027-.043.086-.117.145-.078.062-.14.101-.465-.028l-5.91-4.531-3.57 3.254.75-4.79 9.656-9c.398-.37.265-.448.265-.448.028-.454-.601-.133-.601-.133l-12.176 7.543-.004-.02-5.836-1.965v-.004l-.015-.003a.27.27 0 00.03-.012l.032-.016.031-.011s5.211-2.196 10.508-4.426c2.652-1.117 5.324-2.242 7.379-3.11 2.055-.863 3.574-1.496 3.66-1.53.082-.032.043-.032.102-.032z"
                stroke="white"
              />
            </svg>
          </a>
          <a
            href="https://www.google.com/maps/place/IIV+Malaka+Oshirish+Instituti/@41.2531233,69.3708856,18z/data=!4m13!1m7!3m6!1s0x0:0xa90dcc5b0e9c0477!2zNDHCsDE1JzExLjEiTiA2OcKwMjInMTguMiJF!3b1!8m2!3d41.253086!4d69.371709!3m4!1s0x38ae5f0ec2c37eab:0x10917df4aa48842a!8m2!3d41.2524368!4d69.3714714"
            target="_blank">
            <svg
              stroke="white"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="cursor-pointer w-[25px] h-[25px] sm:w-[30px] sm:h-[30px]"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </a>
          <a href="tel:+998935129494">
            <svg
              stroke="white"
              fill="white"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="cursor-pointer w-[25px] h-[25px] sm:w-[30px] sm:h-[30px]"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"></path>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
