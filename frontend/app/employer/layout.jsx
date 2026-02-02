import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function EmployerLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["employer"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="employer" />
        <div className="flex">
          <Sidebar role="employer" />
          <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
