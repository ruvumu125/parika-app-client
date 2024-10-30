import React, {useEffect, useState} from 'react';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {
    addAdministrator,
    getCompanyAdministrators
} from "../utils/apiFunctions/adminApiFunctions";
import {toast} from "react-toastify";
import {Modal} from "react-bootstrap";
import {deleteCompany} from "../utils/apiFunctions/companyApiFunctions";
import {desableUser, enableUser} from "../utils/apiFunctions/userApiFunctions";
import {useAuth} from "../components/auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import {useGetHeader} from "../components/commons/useGetHeader";
import Cookies from "js-cookie";

const AdminSecondary = () => {

    const [checkedItems, setCheckedItems] = useState({});

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null)
    const name = 'aucun administrateur ';

    //modal declaration
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState("")

    //saving/update declaration
    const [errorMessage, setErrorMessage] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    //pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //search
    const [searchTerm, setSearchTerm] = useState('');

    //enable admin modal declaration
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [userId, setuserId] = useState(0);
    const [isActivatingAdmin, setIsActivatingAdmin] = useState(false);
    const openActivateModal = (id) => {
        setuserId(id);
        setShowActivateModal(true);
    }

    //desable admin modal declaration
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [isDisablingAdmin, setIsDisablingAdmin] = useState(false);
    const openDisableModal = (id) => {
        setuserId(id);
        setShowDisableModal(true);
    }

    //admin secondaire declaration
    const token = Cookies.get("jwtToken");
    const companyId=jwtDecode(token).company_id;
    const idCompany = {
        id: companyId
    };
    const [newSecondaryAdmin, setNewSecondaryAdmin] = useState(
        {
            "id": 0,
            "user": {
                "id": 0,
                "userFullName": "",
                "userEmail": "",
                "userPhoneNumber": "",
                "isUserActive": true
            },
            "company": idCompany
        }
    );

    useEffect(() => {

        fetchCompanyAdmins();
    }, [page,searchTerm]);

    const fetchCompanyAdmins = () => {

        const initialCheckedItems = {};

        getCompanyAdministrators(companyId,searchTerm,page,headers)
            .then((data) => {
                setTotalPages(data.totalPages);
                setData(data.content)
                setIsLoading(false)
                setIsDataFound(true)

                data.content.forEach(item => {
                    initialCheckedItems[item.user.id] = item.user.isUserActive;
                });
                setCheckedItems(initialCheckedItems);


            })
            .catch((error) => {
                setFetchingError(error.message)
                setIsLoading(false)
            })
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset page to 0 when search term changes
    };

    const openAddEditModal = (op,id,userId,userFullName,userEmail,userPhoneNumber,isUserActive) => {
        setOperation(op);

        if (op===1){
            setModalTitle("Créer un administrateur ");
        }
        else if (op===2){
            setModalTitle("Modifier l'administrateur");
            const secondaryAdmin = {
                id: id,
                user: {
                    ...newSecondaryAdmin.user,
                    id: userId,
                    userFullName:userFullName,
                    userEmail:userEmail,
                    userPhoneNumber: userPhoneNumber,
                    isUserActive: isUserActive

                },
                company:idCompany
            };
            setNewSecondaryAdmin(secondaryAdmin);
        }
    }
    const handleCloseModal = () => {
        fetchCompanyAdmins();
        setNewSecondaryAdmin({
            "id": 0,
            "user": {
                "id": 0,
                "userFullName": "",
                "userEmail": "",
                "userPhoneNumber": "",
                "isUserActive": true
            },
            "company": idCompany
        })
        setErrorMessage([]);
    }

    const handleAdminInputChange = (e) => {
        const { name, value } = e.target;

        const secondaryAdmin = {
            id: 0,
            user: {
                ...newSecondaryAdmin.user,[name]: value
            },
            company: idCompany
        };
        setNewSecondaryAdmin(secondaryAdmin);
    }

    const handleSaveAdmin = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await addAdministrator(newSecondaryAdmin,headers)

            if (success !== undefined) {
                setNewSecondaryAdmin({
                    "id": 0,
                    "user": {
                        "id": 0,
                        "userFullName": "",
                        "userEmail": "",
                        "userPhoneNumber": "",
                        "isUserActive": true
                    },
                    "company": idCompany
                })
                setErrorMessage("")
                setIsSaving(false)

                let msg="";
                if(operation===1){
                    msg="Enregistré avec succès";
                }
                else{
                    msg="Modifié avec succès";
                }

                //Toast
                toast.success(msg,{
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });


            } else {
                setIsSaving(false)
            }
        } catch (error) {
            setErrorMessage(error.response.data.errors)
            setIsSaving(false)
        }
    }

    function handleCheckboxChange(id) {

        setCheckedItems({
            ...checkedItems,
            [id]: !checkedItems[id]
        });

        const statut=!checkedItems[id];
        // alert(`Checkbox with ID ${id} clicked. New status: ${!checkedItems[id]}`);

        if (statut===true){
            openActivateModal(id);
        }
        else{
            openDisableModal(id);
        }
    }

    const handleActivateAdmin = async (e) => {
        setIsActivatingAdmin(true);
        try {
            const result = await enableUser(userId);

            if (result.status === 200) {

                setShowActivateModal(false);
                setIsActivatingAdmin(false);
                fetchCompanyAdmins();

                //Toast
                toast.success("Activer avec succès",{
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            } else {

                setShowActivateModal(false);
                setIsActivatingAdmin(false);
                fetchCompanyAdmins();

                //Toast
                toast.error("Impossible de Supprimer cette entreprise ",{
                    position: "top-right",
                    autoClose: 3500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            }
        } catch (error) {

            setShowActivateModal(false);
            setIsActivatingAdmin(false);
            fetchCompanyAdmins();

            //Toast
            toast.error("Impossible de Supprimer cette entreprise ",{
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: true,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined,
                theme:"colored"
            });
        }
    }

    const handleDesableAdmin = async (e) => {
        setIsDisablingAdmin(true);
        try {
            const result = await desableUser(userId);

            if (result.status === 200) {

                setShowDisableModal(false);
                setIsDisablingAdmin(false);
                fetchCompanyAdmins();

                //Toast
                toast.success("Désactiver avec succès",{
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            } else {

                setShowDisableModal(false);
                setIsDisablingAdmin(false);
                fetchCompanyAdmins();

                //Toast
                toast.error("Impossible bas",{
                    position: "top-right",
                    autoClose: 3500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            }
        } catch (error) {

            console.log(error);

            setShowDisableModal(false);
            setIsDisablingAdmin(false);
            fetchCompanyAdmins();

            //Toast
            toast.error("Impossible bassi ",{
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: true,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined,
                theme:"colored"
            });
        }
    }

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Administrateur</h4>
                        <h6>Gérer des administrateurs</h6>
                    </div>
                </div>
                <div className="page-btn">
                    <a
                        onClick={() =>openAddEditModal(1) }
                        className="btn btn-added"
                        data-bs-toggle="modal"
                        data-bs-target="#add-secondary-admin">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-plus-circle me-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg> Nouveau administrateur
                    </a>
                </div>
            </div>


            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton title="Liste des administrateurs"/>):(
                            <>
                                <div className="table-top">
                                    <div className="search-set">
                                        <h4>Liste d'administrateurs</h4>

                                    </div>
                                    <div className="search-path">
                                        <input
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Rechercher un administrateur"
                                            type="text"
                                            className="form-control"/>
                                    </div>

                                </div>
                                {
                                    data.length===0 ?(<NoDataFound name={name}/>):(
                                        <>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th>Nom</th>
                                                        <th>Adresse e-mail</th>
                                                        <th>Nº de téléphone</th>
                                                        <th>Type</th>
                                                        <th>Statut</th>
                                                        <th>Activer/Desact</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((secondary_admin) => {
                                                            return(
                                                                <tr key={secondary_admin.user.id}>
                                                                    <td>{secondary_admin.user.userFullName}</td>
                                                                    <td>{secondary_admin.user.userEmail}</td>
                                                                    <td>{secondary_admin.user.userPhoneNumber}</td>
                                                                    <td>
                                                                        {secondary_admin.adminTypeEnum === "MAIN_ADMIN" ? (
                                                                            <span>Administrateur primaire</span>
                                                                        ) : (
                                                                            <span>Administrateur secondaire</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {secondary_admin.user.isUserActive === true ? (
                                                                            <span className="badge badge-linesuccess">Active</span>
                                                                        ) : (
                                                                            <span className="badges-inactive">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <label className="checkboxs">
                                                                            <input
                                                                                disabled={secondary_admin.adminTypeEnum === "MAIN_ADMIN"}
                                                                                type="checkbox"
                                                                                checked={checkedItems[secondary_admin.user.id] || false}
                                                                                onChange={() => handleCheckboxChange(secondary_admin.user.id)}
                                                                            />
                                                                            <span className="checkmarks"></span>
                                                                        </label>

                                                                        {/*<input*/}
                                                                        {/*    type="checkbox"*/}
                                                                        {/*    id={`checkbox-${secondary_admin.user.id}`}*/}
                                                                        {/*    name="kio"*/}
                                                                        {/*    checked={secondary_admin.user.isUserActive === true}*/}
                                                                        {/*    onChange={() => toggleCheckbox(secondary_admin.user.id)}*/}

                                                                        {/*/>*/}
                                                                    </td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                style={{pointerEvents:secondary_admin.adminTypeEnum === "MAIN_ADMIN" ? 'none' : ''}}

                                                                                onClick={(e) =>  openAddEditModal(
                                                                                    2,
                                                                                    secondary_admin.id,
                                                                                    secondary_admin.user.id,
                                                                                    secondary_admin.user.userFullName,
                                                                                    secondary_admin.user.userEmail,
                                                                                    secondary_admin.user.userPhoneNumber,
                                                                                    secondary_admin.user.isUserActive)
                                                                                }
                                                                                className="me-2 p-2"
                                                                                href="#"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-secondary-admin">
                                                                                <i data-feather="edit" className="feather-edit"></i>
                                                                            </a>
                                                                            <a
                                                                                href=""
                                                                                style={{pointerEvents:secondary_admin.adminTypeEnum === "MAIN_ADMIN" ? 'none' : ''}}
                                                                                className="confirm-text-updated p-2"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#info-alert-modal">
                                                                                <i data-feather="trash-2" className="feather-trash-2"></i>
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="all_tables_pagination">
                                                <Pagination
                                                    totalPages={totalPages}
                                                    currentPage={page}
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>

            { isNoDataFound && <NoDataFound name={name}/>}

            <div className="modal fade" id="add-secondary-admin">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content-momo">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>{modalTitle}</h4>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    {
                                        errorMessage.length>0 &&( <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <ul>
                                                {
                                                    errorMessage.map((key,index)=>{
                                                        return(
                                                            <li key={index}>{key}</li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>)
                                    }
                                    <form onSubmit={handleSaveAdmin}>

                                        <div className="mb-3">
                                            <label className="form-label">Nom complet de l'utilisateur</label>
                                            <input
                                                id="userFullName"
                                                name="userFullName"
                                                value={newSecondaryAdmin.user.userFullName}
                                                onChange={handleAdminInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nom complet de l'utilisateur"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Adresse e-mail</label>
                                            <input
                                                id="userEmail"
                                                name="userEmail"
                                                value={newSecondaryAdmin.user.userEmail}
                                                onChange={handleAdminInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Adresse e-mail"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nº de téléphone</label>
                                            <input
                                                id="userPhoneNumber"
                                                name="userPhoneNumber"
                                                value={newSecondaryAdmin.user.userPhoneNumber}
                                                onChange={handleAdminInputChange}
                                                type="number"
                                                className="form-control"
                                                placeholder="Nº de téléphone"/>
                                        </div>

                                        <div className="modal-footer-btn">
                                            <button type="submit" className="btn btn-submit">
                                                {isSaving && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="sr-only"></span></>)}
                                                Enregistrer
                                            </button>
                                            <button
                                                style={{marginLeft:"10px"}}
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                data-bs-dismiss="modal"
                                                onClick={handleCloseModal}>Fermer
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*delete modal*/}
            <div id="info-alert-modal" className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-body p-4">
                            <div className="text-center">
                                <i className="dripicons-information h1 text-info"></i>
                                <h4 className="mt-2">Confirmation!</h4>
                                <p className="mt-3">Voulez-vous vraiment supprimer ?</p>
                                <div className="modal-footer-btn">
                                    <button type="button" className="btn btn-cancel me-2" data-bs-dismiss="modal">Annuler</button>
                                    <button type="submit" className="btn btn-danger">
                                        <span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="sr-only"></span>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*activate admin modal*/}
            <Modal show={showActivateModal} onHide={() => setShowActivateModal(false)} size="sm">
                <Modal.Body className="modal-body p-4">
                    <div className="text-center">
                        <i className="dripicons-information h1 text-info"></i>
                        <h4 className="mt-2">Confirmation!</h4>
                        <p className="mt-3">Voulez-vous vraiment activer ?</p>
                        <div className="modal-footer-btn">

                            <button
                                onClick={handleActivateAdmin}
                                type="button"
                                className="btn btn-danger">
                                {isActivatingAdmin && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Activer
                            </button>
                            <button
                                onClick={() => setShowActivateModal(false)}
                                style={{marginLeft:"10px"}}
                                type="button"
                                className="btn btn-cancel me-2">Annuler</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/*disable admin modal*/}
            <Modal show={showDisableModal} onHide={() => setShowDisableModal(false)} size="sm">
                <Modal.Body className="modal-body p-4">
                    <div className="text-center">
                        <i className="dripicons-information h1 text-info"></i>
                        <h4 className="mt-2">Confirmation!</h4>
                        <p className="mt-3">Voulez-vous vraiment désactiver cet utilisateur ?</p>
                        <div className="modal-footer-btn">

                            <button
                                onClick={handleDesableAdmin}
                                type="button"
                                className="btn btn-danger">
                                {isDisablingAdmin && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Désactiver
                            </button>
                            <button
                                onClick={() => setShowDisableModal(false)}
                                style={{marginLeft:"10px"}}
                                type="button"
                                className="btn btn-cancel me-2">Annuler</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );

}

export default AdminSecondary;