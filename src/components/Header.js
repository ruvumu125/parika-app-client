import React, {useContext} from 'react';
import {AuthContext} from "./auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const Header = () =>{

    //user full name and role
    const token = Cookies.get("jwtToken");
    const userFullName = jwtDecode(token).userfullname;
    const userRole = jwtDecode(token).userrole;
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const logout = () => {
        auth.handleLogout();
        navigate("/", { state: { message: " You have been logged out!" } })
    }

    return (
        <React.Fragment>
            <section>
                <div className="header">

                    <div className="header-left active">
                        <a href="" className="logo logo-normal">
                            <img src="/img/logo.png" alt=""/>
                        </a>
                        <a href="" className="logo logo-white">
                            <img src="/img/logo-white.png" alt=""/>
                        </a>
                        <a href="" className="logo-small">
                            <img src="/img/logo-small.png" alt=""/>
                        </a>
                        <a id="toggle_btn" href="#">
                            <i data-feather="chevrons-left" className="feather-16"></i>
                        </a>
                    </div>
                    <a id="mobile_btn" className="mobile_btn" href="#sidebar">
                        <span className="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                        </span>
                    </a>

                    <ul className="nav user-menu">
                        <li className="nav-item nav-searchinputs">
                        </li>
                        <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
                        </li>
                        <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
                        </li>
                        <li className="nav-item nav-item-box">
                        </li>
                        <li className="nav-item nav-item-box">
                        </li>
                        <li className="nav-item dropdown nav-item-box">

                        </li>
                        <li className="nav-item nav-item-box">
                        </li>
                        <li className="nav-item dropdown has-arrow main-drop">
                            <a className="dropdown-toggle nav-link userset" data-bs-toggle="dropdown" href="#">
                              <span className="user-info">
                              <span className="user-letter">
                              <img src="/img/avatar3.png"  className="img-fluid" alt=""/>
                              </span>
                              <span className="user-detail">
                              <span className="user-name">{userFullName}</span>
                              <span className="user-role">{userRole}</span>
                              </span>
                              </span>
                            </a>
                            <div className="dropdown-menu menu-drop-user">
                                <div className="profilename">
                                    <div className="profileset">
                                       <span className="user-img"><img src="/img/avatar3.png" alt=""/>
                                       <span className="status online"></span></span>
                                        <div className="profilesets">
                                            <h6>{userFullName}</h6>
                                            <h5>{userRole}</h5>
                                        </div>
                                    </div>
                                    <hr className="m-0"/>
                                    <a className="dropdown-item" href="profile.html"> <i className="me-2" data-feather="user"></i> My
                                        Profile</a>
                                    <a className="dropdown-item" href="general-settings.html"><i className="me-2" data-feather="settings"></i>Settings</a>
                                    <hr className="m-0"/>
                                    <a href="#"
                                       onClick={logout}
                                       className="dropdown-item logout pb-0">
                                        <img src="/img/log-out.svg" className="me-2" alt="img"/>Déconnexion
                                    </a>

                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="dropdown mobile-user-menu">
                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="profile.html">My Profile</a>
                            <a className="dropdown-item" href="">Settings</a>
                            <a
                                href="#"
                                onClick={logout}
                                className="dropdown-item logout pb-0">
                                <img src="/img/log-out.svg" className="me-2" alt="img"/>Déconnexion
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Header;