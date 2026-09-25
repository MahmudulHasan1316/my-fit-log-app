import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png"

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-black">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">


        {/* ===> Logo <=== */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="FITLOG Logo" className="h-8 w-8" />

          <span className="text-base font-extrabold tracking-wide text-white">
            FITLOG
          </span>
        </Link>


        {/* ===> Copyright <=== */}
        <p className="text-center text-xs text-slate-500 md:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
