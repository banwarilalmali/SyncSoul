import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
export default function ProtectedRoute({ children }) {
  // TODO: Restore the cookie-backed session from the server before guarding routes.
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
}
