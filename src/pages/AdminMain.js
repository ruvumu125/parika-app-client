import React, {useEffect, useState} from 'react';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {addAdministrator, getMainAdministrators} from "../utils/apiFunctions/adminApiFunctions";
import {toast} from "react-toastify";
import {getCompaniesWithoutMainAdmin} from "../utils/apiFunctions/companyApiFunctions";
import {desableUser, enableUser} from "../utils/apiFunctions/userApiFunctions";
import {Modal} from "react-bootstrap";
import {useGetHeader} from "../components/commons/useGetHeader";

const AdminMain = () => {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null)
    const [checkedItems, setCheckedItems] = useState({});
    const name = "aucun administrateur";

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

    //admin principal declaration
    const [newMainAdmin, setNewMainAdmin] = useState(
        {
            "id": 0,
            "user": {
                "id": 0,
                "userFullName": "",
                "userEmail": "",
                "userPhoneNumber": "",
                "isUserActive": true
            },
            "company": {
                "id": 0
            }
        }
    );

    //selector declaration
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [selectedCompanyName, setSelectedCompanyName] = useState("---Sélectionner une entreprise---");

    useEffect(() => {
        fetchMainAdmins();
        fetchCompanies();
    }, [page,searchTerm]);

    const fetchMainAdmins = () => {

        const initialCheckedItems = {};

        getMainAdministrators(searchTerm,page,headers)
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

    const fetchCompanies=() => {
        getCompaniesWithoutMainAdmin()
            .then((data) => {
                setCompanies(data)

            })
            .catch((error) => {
            })
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset page to 0 when search term changes
    };

    const openAddEditModal = (op,id,userId,userFullName,userEmail,userPhoneNumber,isUserActive,companyId,companyName) => {
        setOperation(op);

        if (op===1){
            setModalTitle("Créer un administrateur ");
        }
        else if (op===2){
            setModalTitle("Modifier l'administrateur");
            const mainAdmin = {
                id: id,
                user: {
                    ...newMainAdmin.user,
                    id: userId,
                    userFullName:userFullName,
                    userEmail:userEmail,
                    userPhoneNumber: userPhoneNumber,
                    isUserActive: isUserActive

                },
                company: {
                    ...newMainAdmin.company, id:companyId
                }
            };
            setNewMainAdmin(mainAdmin);
            setSelectedCompanyId(companyId);
            setSelectedCompanyName(companyName);
        }
    }

    const handleCloseModal = () => {
        fetchMainAdmins();
        setNewMainAdmin({
            "id": 0,
            "user": {
                "id": 0,
                "userFullName": "",
                "userEmail": "",
                "userPhoneNumber": "",
                "isUserActive": true
            },
            "company": {
                "id": 0
            }
        })
        setErrorMessage([]);
    }

    const handleMainUserInputChange = (e) => {
        const { name, value } = e.target;

        const mainAdmin = {
            id: 0,
            user: {
                ...newMainAdmin.user,[name]: value
            },
            company: {
                ...newMainAdmin.company, [name]: value
            }
        };
        setNewMainAdmin(mainAdmin);
    }

    const handleSaveMainAdmin = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await addAdministrator(newMainAdmin,headers)

            if (success !== undefined) {
                setNewMainAdmin({
                    "id": 0,
                    "user": {
                        "id": 0,
                        "userFullName": "",
                        "userEmail": "",
                        "userPhoneNumber": "",
                        "isUserActive": true
                    },
                    "company": {
                        "id": 0
                    }
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
                fetchMainAdmins();

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
                fetchMainAdmins();

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
            fetchMainAdmins();

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
                fetchMainAdmins();

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
                fetchMainAdmins();

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
            fetchMainAdmins();

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
                        data-bs-target="#add-main-admin">
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
                                        <h4>Liste des administrateurs</h4>

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
                                                        <th>Statut</th>
                                                        <th>Entreprise</th>
                                                        <th>Activer/Désactiver</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((main_admin) => {
                                                            return(
                                                                <tr key={main_admin.user.id}>
                                                                    <td>{main_admin.user.userFullName}</td>
                                                                    <td>{main_admin.user.userEmail}</td>
                                                                    <td>{main_admin.user.userPhoneNumber}</td>
                                                                    <td>{main_admin.company.companyName}</td>
                                                                    <td>
                                                                        {main_admin.user.isUserActive === true ? (
                                                                            <span className="badge badge-linesuccess">Active</span>
                                                                        ) : (
                                                                            <span className="badges-inactive">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <label className="checkboxs">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checkedItems[main_admin.user.id] || false}
                                                                                onChange={() => handleCheckboxChange(main_admin.user.id)}
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
                                                                                onClick={(e) =>  openAddEditModal(
                                                                                    2,
                                                                                    main_admin.id,
                                                                                    main_admin.user.id,
                                                                                    main_admin.user.userFullName,
                                                                                    main_admin.user.userEmail,
                                                                                    main_admin.user.userPhoneNumber,
                                                                                    main_admin.user.isUserActive,
                                                                                    main_admin.company.id,
                                                                                    main_admin.company.companyName)
                                                                                }
                                                                                className="me-2 p-2"
                                                                                href="#"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-main-admin">

                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="24" height="24"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="feather feather-edit">
                                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                                </svg>
                                                                            </a>
                                                                            <a className="confirm-text-updated p-2" data-bs-toggle="modal" data-bs-target="#info-alert-modal">
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
                                                                                    className="feather feather-trash-2">
                                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                                </svg>
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

            {/*add main admin modal*/}
            <div className="modal fade" id="add-main-admin">
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
                                    <form onSubmit={handleSaveMainAdmin}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom complet de l'utilisateur</label>
                                            <input
                                                id="userFullName"
                                                name="userFullName"
                                                value={newMainAdmin.user.userFullName}
                                                onChange={handleMainUserInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nom complet de l'utilisateur"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Adresse e-mail de l'utilisateur</label>
                                            <input
                                                id="userEmail"
                                                name="userEmail"
                                                value={newMainAdmin.user.userEmail}
                                                onChange={handleMainUserInputChange}
                                                className="form-control h-100"
                                                type="text"
                                                placeholder="Adresse e-mail de l'utilisateur"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nº de téléphone de l'utilisateur</label>
                                            <input
                                                id="userPhoneNumber"
                                                name="userPhoneNumber"
                                                value={newMainAdmin.user.userPhoneNumber}
                                                onChange={handleMainUserInputChange}
                                                type="number"
                                                className="form-control"
                                                placeholder="Nº de téléphone de l'utilisateur"/>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Entreprise</label>
                                            <select
                                                id="id"
                                                name="id"
                                                className="form-select"
                                                value={newMainAdmin.company.id}
                                                onChange={handleMainUserInputChange}>
                                                <option value={selectedCompanyId}>{selectedCompanyName}</option>
                                                {
                                                    operation === 1 ? (
                                                        companies.map((company) => (
                                                            <option
                                                                key={company.id}
                                                                value={company.id}>{company.companyName
                                                            }</option>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )
                                                }

                                            </select>
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
                                                onClick={handleCloseModal}>Annuler
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
                                <p className="mt-3">Voulez-vous vraiment supprimer ?.</p>
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
export default AdminMain;