import Navbar from "@/components/navbar";
import Chart from "@/components/chart";
import Dashboard from "@/components/pages/dashboard";
import QuickSection from "@/components/quick-section";

export default function Home() {

  return (
    <>
      <Navbar />
      <Dashboard />
      <Chart />
      <QuickSection />
    </>
  );
}
