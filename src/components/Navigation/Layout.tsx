import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useVisitorTracking } from "@/hooks/dashboard/useVisitorTracking";


export default function Layout() {
  useVisitorTracking();
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
