import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, role }) {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/" replace />;
    if (role && user.role !== role && user.role !== role.toUpperCase() && user.role !== role.toLowerCase()) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
