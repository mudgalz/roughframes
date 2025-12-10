import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export const StaticLayout = () => {
  return (
    <div
      data-slot="layout"
      className=" relative z-10 flex overflow-y-auto custom-scroll h-svh flex-col">
      <Header />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
