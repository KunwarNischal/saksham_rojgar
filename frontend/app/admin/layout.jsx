import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 w-full lg:w-auto overflow-x-hidden">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
