import { useUser } from "@/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const user = useUser((s) => s.user);

  if (!user) return <Navigate to="/identify" replace />;

  return <Outlet />;
}
