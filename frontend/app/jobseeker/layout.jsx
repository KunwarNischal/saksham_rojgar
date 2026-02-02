import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function JobSeekerLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="jobseeker" />
        <div className="flex">
          <Sidebar role="jobseeker" />
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
