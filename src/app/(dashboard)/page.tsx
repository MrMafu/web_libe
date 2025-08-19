import { DashboardProvider } from "@/api/contexts/dashboard-context";
import Dashboard from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}