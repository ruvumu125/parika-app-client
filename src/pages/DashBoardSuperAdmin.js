import React, {useEffect, useState} from 'react';
import {getDashboardCount} from "../utils/apiFunctions/dashboardSuperAdmin.js";
import SkletonDashboardCount from "../components/commons/SkletonDashboardCount.js";
import {useGetHeader} from "../components/commons/useGetHeader";

const DashboardSuperAdmin=()=> {

    const headers = useGetHeader();
    const [isLoading, setIsLoading] = useState(true);
    const [newDashboardCount, setNewDashboardCount] = useState({
        companyCount: 0,
        vehicleCount: 0,
        vehicleTypeCount: 0
    });
    useEffect(() => {
        fetchDashboard();
    }, []);
    const fetchDashboard = () => {

        getDashboardCount (headers)
            .then((data) => {
                console.log(data);
                setNewDashboardCount(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
            })

    }

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Type de produit</h4>
                        <h6>Gérer des types de produit</h6>
                    </div>
                </div>
            </div>

            {
                isLoading ? (<><SkletonDashboardCount/><br/></>):(
                    <>
                        <div className="row">
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="dash-count">
                                    <div className="dash-counts">
                                        <h4>{newDashboardCount.companyCount}</h4>
                                        <h5>Nombre de menages</h5>
                                    </div>
                                    <div className="dash-imgs">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-user">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="dash-count das1">
                                    <div className="dash-counts">
                                        <h4>{newDashboardCount.vehicleCount}</h4>
                                        <h5>Nombre de fornisseurs</h5>
                                    </div>
                                    <div className="dash-imgs">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-user-check">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <polyline points="17 11 19 13 23 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="dash-count das2">
                                    <div className="dash-counts">
                                        <h4>{newDashboardCount.vehicleTypeCount}</h4>
                                        <h5>Nombre de camps</h5>
                                    </div>
                                    <div className="dash-imgs">
                                        <img src="assets/img/file-text-icon-01.svg" className="img-fluid" alt="icon"/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="dash-count das3">
                                    <div className="dash-counts">
                                        <h4>170</h4>
                                        <h5>Nombre </h5>
                                    </div>
                                    <div className="dash-imgs">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-file">
                                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                            <polyline points="13 2 13 9 20 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </React.Fragment>
    );
}

export default DashboardSuperAdmin;