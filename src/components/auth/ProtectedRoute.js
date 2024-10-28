import React from 'react';
import {Navigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie"; // Custom hook to get the auth context

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
    const token = Cookies.get("jwtToken");

    if (!token) {
        return <Navigate to="/" />;
    }

    const userRole = jwtDecode(token).userrole;
    let role_utilisateur="";

    if(userRole==="SUPERADMIN"){
        role_utilisateur=jwtDecode(token).superadmintype;
    }
    else if (userRole==="ADMIN"){
        role_utilisateur=jwtDecode(token).admintype;
    }
    else{
        role_utilisateur=userRole;
    }

    if (!allowedRoles.includes(role_utilisateur)) {
        Cookies.remove("jwtToken");
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;