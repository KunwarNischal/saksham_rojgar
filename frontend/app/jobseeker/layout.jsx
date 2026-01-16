import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function JobSeekerLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="jobseeker" />
        <div className="flex-1 w-full lg:w-auto overflow-x-hidden">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
