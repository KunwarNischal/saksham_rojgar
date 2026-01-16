"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Double check localStorage directly
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (!loading) {
      // If no token or user in localStorage OR not authenticated in context, redirect to login
      if (!token || !storedUser || !isAuthenticated || !user) {
        router.replace("/login");
        return;
      }

      // Parse stored user to verify
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      // If role-based access is defined and user doesn't have the right role
      if (allowedRoles.length > 0 && parsedUser && !allowedRoles.includes(parsedUser?.role)) {
        // Redirect to appropriate dashboard based on user role
        switch (parsedUser?.role) {
          case "jobseeker":
            router.replace("/jobseeker/dashboard");
            break;
          case "employer":
            router.replace("/employer/dashboard");
            break;
          case "admin":
            router.replace("/admin/dashboard");
            break;
          default:
            router.replace("/");
        }
        return;
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, user, allowedRoles, router, loading]);

  // Show loading while checking auth
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
