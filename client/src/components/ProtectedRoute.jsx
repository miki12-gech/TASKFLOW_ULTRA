import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/auth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  // 1. Centralized Auth Check
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: getUserProfile,
    retry: false // Don't keep trying if 401
  });

  // 2. Show a Loading Spinner while we check cookies
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-blue-500 gap-2">
         <Loader2 className="animate-spin" size={40} />
         <span className="font-bold text-lg">Authenticating...</span>
      </div>
    );
  }

  // 3. Security Check Failed? -> Kick to Login
  // "replace" means they can't click Back button to return here
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Success? -> Render the requested page (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;