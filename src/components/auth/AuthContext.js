import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';


// Create the AuthContext
export const AuthContext = createContext({
    user: null,
    handleLogin: (token) => {},
    handleLogout: () => {}
});

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = Cookies.get("jwtToken"); // Retrieve token from cookies
        return token ? jwtDecode(token) : null; // Decode the token if it exists
    });

    const handleLogin = (token) => {
        const decodedUser = jwtDecode(token);
        Cookies.set("jwtToken", token, { expires: 7, sameSite: 'strict' }); // Set cookie for 7 days
        //Cookies.set("jwtToken", token, { expires: 7, secure: true, sameSite: 'strict' }); // Set cookie for 7 days
        setUser(decodedUser);
    }

    const handleLogout = () => {
        Cookies.remove("jwtToken"); // Remove the cookie
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
}

