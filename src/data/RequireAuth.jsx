import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({ children }) => {
	const user = useSelector((state) => state.value);
	const location = useLocation();

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	const isAdminRoute = location.pathname.startsWith("/admin");

	if (user.user.role === "Admin" && !isAdminRoute) {
		return <Navigate to="/admin/pets" replace />;
	}

	if (user.user.role !== "Admin" && isAdminRoute) {
		return <Navigate to="/pets" replace />;
	}

	return children;
};

export default RequireAuth;
