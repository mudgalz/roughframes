import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="flex flex-1 flex-col justify-between gap-12 overflow-x-hidden py-12 pt-24 sm:gap-16 sm:py-20 lg:gap-24 lg:py-28">
      {/* Hero Content */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        {/* Badge row */}
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/20">
            New
          </Badge>
          <span className="text-gray-400">
            Visual Annotation for Images, PDFs & Frames
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Draw. Annotate.
          <br />
          <span className="relative">
            Review Faster.
            <svg
              width="223"
              height="12"
              viewBox="0 0 223 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden">
              <path
                d="M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551"
                stroke="url(#paint0_linear)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="18.8541"
                  y1="3.72033"
                  x2="42.6487"
                  y2="66.6308"
                  gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--primary)" />
                  <stop offset="1" stopColor="var(--primary-foreground)" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
          RoughFrames is a modern canvas to draw, sketch, and annotate images
          and PDFs. Leave visual feedback, mark precise areas, review work
          clearly, and collaborate faster — with video frame annotation coming
          next.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          asChild
          className="bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500">
          <Link to="/identify">Start Using RoughFrames</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
