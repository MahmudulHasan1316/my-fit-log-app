"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";


const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#000000]">
      <nav className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ===> Logo <=== */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="FITLOG Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
          />

          <span className="text-base font-extrabold tracking-wide text-white sm:text-lg">
            FITLOG
          </span>
        </Link>

        {/* ===> Desktop/Tablet(Active Route/Page) <=== */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/workouts"
            className={
              pathname === "/workouts"
                ? "rounded-full bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-400 transition-all duration-200 hover:bg-lime-400/20"
                : ""
            }
          >
            Workouts
          </Link>
          <Link
            href="/myplan"
            className={
              pathname === "/myplan"
                ? "rounded-full bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-400 transition-all duration-200 hover:bg-lime-400/20"
                : ""
            }
          >
            My Plan
          </Link>
        </div>

        {/* ===> Right Actions <=== */}
        <div className="hidden items-center gap-5 md:flex">
         
          {/* ===> Plan <=== */}
          <Link
            href="/myplan"
            className="group flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-white"
          >
            <span>Plan</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1.5 text-[10px] font-bold text-slate-950">
              0
            </span>
          </Link>

          {/* ===> Saved <=== */}
          <Link
            href="/myplan"
            className="group flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-white"
          >
            <span>Saved</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-1.5 text-[10px] text-slate-400 transition-colors group-hover:border-slate-500 group-hover:text-white">
              0
            </span>
          </Link>
        </div>


        {/* ===> Mobile Menu <=== */}
        <details className="dropdown dropdown-end md:hidden">
          <summary className="btn btn-ghost btn-sm list-none border-0 p-2 text-slate-300 hover:bg-white/5 hover:text-white">

          
            {/* ===> Hamburger <=== */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </summary>

          <ul className="menu dropdown-content z-50 mt-3 w-56 rounded-xl border border-slate-800 bg-[#111419] p-2 shadow-2xl">
            <li>
              <Link
                href="/workouts"
                className="text-sm font-medium text-lime-400 hover:bg-lime-400/10"
              >
                Workouts
              </Link>
            </li>

            <li>
              <Link
                href="/plan"
                className="text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                My Plan
              </Link>
            </li>

            <div className="my-1 border-t border-slate-800" />

            <li>
              <Link
                href="/plan"
                className="flex items-center justify-between text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <span>Plan</span>

                <span className="badge badge-sm border-0 bg-lime-400 font-bold text-slate-950">
                  0
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/saved"
                className="flex items-center justify-between text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <span>Saved</span>

                <span className="badge badge-sm border-slate-700 bg-slate-900 text-slate-400">
                  0
                </span>
              </Link>
            </li>
          </ul>
        </details>
      </nav>
    </header>
  );
};

export default Navbar;
