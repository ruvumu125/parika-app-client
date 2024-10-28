import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie"; // Import your useAuth hook

const RequireAuth = ({ children }) => {

    const token = Cookies.get("jwtToken");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" state={{ path: location.pathname }} />;

    }

    return children;
};

export default RequireAuth;
