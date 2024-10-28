import React, { useState } from "react";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../components/auth/AuthContext";
import {loginUser} from "../utils/apiFunctions/loginApiFunctions";

const Login = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [login, setLogin] = useState({
        email: "",
        password: ""
    });
    const auth = useAuth();

    const handleInputChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMessage("");

        try {
            const success = await loginUser(login); // Assume loginUser is your API call for logging in
            if (success) {
                const token = success.token;
                console.log(token);
                auth.handleLogin(token);

                const userRole = jwtDecode(token).userrole; // Decode token to get user role

                const paths = {
                    SUPERADMIN: '/companies',
                    ADMIN: '/dashboard'
                };

                setIsSaving(false);

                // Check if the role exists in the paths object before redirecting
                if (paths[userRole]) {
                    window.location.href = paths[userRole];
                } else {
                    console.error('Role not found or no path defined for this role');
                }

            } else {
                setErrorMessage("Invalid username or password. Please try again.");
                setIsSaving(false);
            }
        } catch (error) {
            setErrorMessage("An error occurred during login. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <div className="main-wrapper">
            <div className="account-content">
                <div className="login-wrapper login-new">
                    <div className="container">
                        <div className="login-content user-login">
                            <div className="login-logo">
                                <img src="/img/logo.png" alt="" />
                                <a href="index.html" className="login-logo logo-white">
                                    <img src="/img/logo-white.png" alt="" />
                                </a>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="login-userset">
                                    <div className="login-userheading">
                                        <h3>Connexion</h3>
                                        <h4>Accéder à votre compte en utilisant votre Adresse email et votre mot de passe.</h4>
                                    </div>
                                    {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                                    <div className="form-login">
                                        <label className="form-label">Adresse email</label>
                                        <div className="form-addons">
                                            <input
                                                placeholder="Adresse email"
                                                value={login.email}
                                                onChange={handleInputChange}
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="form-control" />
                                            <img
                                                src="/img/mail.svg"
                                                alt="img" />
                                        </div>
                                    </div>
                                    <div className="form-login">
                                        <label>Mot de passe</label>
                                        <div className="pass-group">
                                            <input
                                                placeholder="Mot de passe"
                                                value={login.password}
                                                onChange={handleInputChange}
                                                id="password"
                                                name="password"
                                                type="password"
                                                className="pass-input" />
                                            <span className="fas toggle-password fa fa-eye-slash fa-lg"></span>
                                        </div>
                                    </div>
                                    <div className="form-login authentication-check">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="custom-control custom-checkbox">
                                                    <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                                                        <input type="checkbox" />
                                                        <span className="checkmarks"></span>Remember me
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-6 text-end">
                                                <a className="forgot-link" href="forgot-password-3.html">Mot de passe oublié ?</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-login">
                                        <button className="btn btn-login" type="submit" disabled={isSaving}>
                                            {isSaving && (
                                                <>
                                                    <span style={{ marginRight: "6px" }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="sr-only"></span>
                                                </>
                                            )}
                                            Sign In
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                            <p>Copyright &copy; 2023 DreamsPOS. All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
