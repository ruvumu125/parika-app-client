import React from 'react';
import { Routes, Route } from "react-router-dom";
import Company from "../pages/Company";
import VehiculeType from "../pages/VehiculeType";
import Price from "../pages/Price";
import ParkingSpace from "../pages/ParkingSpace";
import SuperAdmin from "../pages/SuperAdmin";
import AdminMain from "../pages/AdminMain";
import AdminSecondary from "../pages/AdminSecondary";
import Agent from "../pages/Agent";
import Vehicule from "../pages/Vehicule";
import Collections from "../pages/Collections";
import DashBoardSuperAdmin from "../pages/DashBoardSuperAdmin";
import DashBoardAdmin from "../pages/DashBoardAdmin";
import ProtectedRoute from "./auth/ProtectedRoute";

const NavPage = () => {
    return (
        <React.Fragment>
            <section>
                <Routes>

                    <Route path="/dashboard-main" element={<ProtectedRoute element={DashBoardSuperAdmin} allowedRoles={['MAIN_SUPERADMIN','SECONDARY_SUPERADMIN']} />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={DashBoardAdmin} allowedRoles={['MAIN_ADMIN','SECONDARY_ADMIN']} />} />

                    <Route path="/companies" element={<ProtectedRoute element={Company} allowedRoles={['MAIN_SUPERADMIN','SECONDARY_SUPERADMIN']} />} />
                    <Route path="/vehicule-types" element={<ProtectedRoute element={VehiculeType} allowedRoles={['MAIN_SUPERADMIN','SECONDARY_SUPERADMIN']} />} />
                    <Route path="/vehicules" element={<ProtectedRoute element={Vehicule} allowedRoles={['MAIN_SUPERADMIN','SECONDARY_SUPERADMIN']} />} />
                    <Route path="/prices" element={<ProtectedRoute element={Price} allowedRoles={['MAIN_ADMIN','SECONDARY_ADMIN']} />} />
                    <Route path="/parking-spaces" element={<ProtectedRoute element={ParkingSpace} allowedRoles={['MAIN_ADMIN','SECONDARY_ADMIN']} />} />

                    <Route path="/collections" element={<ProtectedRoute element={Collections} allowedRoles={['MAIN_ADMIN','SECONDARY_ADMIN']} />} />
                    <Route path="/all-collections" element={<ProtectedRoute element={Collections} allowedRoles={['MAIN_SUPERADMIN','SECONDARY_SUPERADMIN']} />} />

                    <Route path="/super-admins" element={<ProtectedRoute element={SuperAdmin} allowedRoles={["MAIN_SUPERADMIN"]} />} />
                    <Route path="/main-admins" element={<ProtectedRoute element={AdminMain} allowedRoles={['MAIN_SUPERADMIN']} />} />
                    <Route path="/admins" element={<ProtectedRoute element={AdminSecondary} allowedRoles={['MAIN_ADMIN']} />} />
                    <Route path="/agents" element={<ProtectedRoute element={Agent} allowedRoles={['MAIN_ADMIN']} />} />
                </Routes>
            </section>
        </React.Fragment>
    );
}

export default NavPage;