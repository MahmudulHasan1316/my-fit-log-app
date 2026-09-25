import Link from "next/link";

const NotfoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 sm:px-6">
      <div className="w-full max-w-2xl text-center">

        <p className="text-7xl font-black tracking-tight text-primary sm:text-8xl md:text-9xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-base-content sm:mt-5 sm:text-3xl md:mt-6 md:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md px-2 text-sm leading-6 text-base-content/60 sm:mt-4 sm:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="btn w-full border-0 bg-emerald-500 px-6 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 sm:w-auto"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/workouts"
            className="btn w-full border-slate-300 bg-white px-6 text-slate-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:bg-slate-50 hover:shadow-lg sm:w-auto"
          >
            View Workouts
          </Link>
        </div>

      </div>
    </main>
  );
};

export default NotfoundPage;