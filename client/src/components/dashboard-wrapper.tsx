import ProtectedRoute from "@/components/protected-route";
import Dashboard from "@/pages/dashboard";

export default function DashboardWrapper() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}