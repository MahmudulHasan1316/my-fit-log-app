import Image from "next/image";
import Link from "next/link";
import BannerImage from "@/assets/banner.png";

const Banner = () => {
  return (
    <main className="min-h-screen bg-[#000000]">
      <section
        className="container  
          mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      >
        <div
          className="overflow-hidden
          rounded-2xl mt-30
          border border-slate-800
          bg-[#14161b]
          shadow-2xl
        "
        >
          <div
            className="
            grid
            min-h-85
            grid-cols-1
            items-center
            gap-8
            px-6
            py-8
            sm:px-8
            sm:py-10
            md:grid-cols-2
            md:gap-6
            md:px-10
            lg:min-h-100
            lg:gap-10
            lg:px-12
            lg:py-12
          "
          >

            {/* ===> LEFT CONTENT <=== */}
            <div className="order-2 md:order-1">


              {/* ===> Small label <=== */}
              <p
                className="
                mb-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-lime-400

                sm:text-xs
              "
              >
                Workout Library
              </p>


              {/* ===> Heading <=== */}
              <h1
                className="
                max-w-xl
                text-4xl
                font-black
                uppercase
                leading-[0.95]
                tracking-tight
                text-white
                sm:text-5xl
                md:text-4xl
                lg:text-4xl
              "
              >
                TRAIN WITH INTENT. LOG <br/> EVERY SET.
              </h1>


              {/* ===> Description <=== */}
              <p
                className="
                mt-5
                max-w-md
                text-sm
                leading-6
                text-slate-400

                sm:mt-6
                sm:text-base
              "
              >
                FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
                into today&apos;s plan, and watch the week&apos;s work add up.
              </p>

              <div className="mt-6 sm:mt-8">
                <Link
                  href="/workouts"
                  className="btn min-h-10 border-0  bg-lime-400
                  px-5
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-wide
                  text-black
                  shadow-lg
                  shadow-lime-400/10
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:bg-lime-300
                  hover:shadow-xl
                  hover:shadow-lime-400/20

                  active:translate-y-0
                "
                >
                  Browse Workouts
                </Link>
              </div>
            </div>


            {/* ===> RIGHT IMAGE <=== */}
            <div
              className="
              order-1
              flex
              items-center
              justify-center
              md:order-2
              md:justify-end
            "
            >
              <div
                className="
                relative
                h-48
                w-56
                sm:h-56
                sm:w-64
                md:h-64
                md:w-72
                lg:h-80
                lg:w-96
              "
              >
                <Image
                  src={BannerImage}
                  alt="Person doing a workout"
                  className="
                  object-contain
                  drop-shadow-2xl
                "
                  sizes="
                  (max-width: 640px) 224px,
                  (max-width: 768px) 256px,
                  (max-width: 1024px) 288px,
                  384px
                "
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Banner;
