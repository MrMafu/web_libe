import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/app/dashboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
