import React, {useEffect, useState} from 'react';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {addCompany, deleteCompany, getAllCompanies} from "../utils/apiFunctions/companyApiFunctions";
import {toast} from "react-toastify";
import {addAdministrator} from "../utils/apiFunctions/adminApiFunctions";
import {Modal} from "react-bootstrap";
import {deleteParkingPrice} from "../utils/apiFunctions/parkingPriceApiFunctions";
import {useGetHeader} from "../components/commons/useGetHeader";
import Cookies from "js-cookie";

const Company = () => {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null);
    const name = 'aucune entreprise';

    //modal declaration
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState("")

    //saving/update declaration
    const [errorMessage, setErrorMessage] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    //delete declaration
    const [idCompany, setIdCompany] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    //pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //search
    const [searchTerm, setSearchTerm] = useState('');

    const [newCompany, setNewCompany] = useState(
        {
            id: 0,
            companyName: "",
            companyPhoneNumber: "",
            companyAddress: "",
            isCompanyActive:true

        }
    );

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
    const [companyId, setCompanyId] = useState(0);
    const [errorMessageAdmin, setErrorMessageAdmin] = useState([]);
    const [isSavingAdmin, setIsSavingAdmin] = useState(false);

    useEffect(() => {

        fetchCompanies();
        console.log();
    }, [page,searchTerm]);

    const fetchCompanies = () => {

        getAllCompanies(searchTerm,page,headers)
            .then((data) => {

                console.log(data.content)
                setTotalPages(data.totalPages);
                setData(data.content)
                setIsLoading(false)
                setIsDataFound(true)


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

    const openAddEditModal = (op,id,companyName,companyPhoneNumber,companyAddress,isCompanyActive) => {
        setOperation(op);

        if (op===1){
            setModalTitle("Créer une entreprise");
        }
        else if (op===2){
            setModalTitle("Modifier une entreprise");
            setNewCompany({
                id:id,
                companyName:companyName,
                companyPhoneNumber:companyPhoneNumber,
                companyAddress:companyAddress,
                isCompanyActive:isCompanyActive


            })
        }
    }

    const openAddAdminModal = (idCompany) => {
        setCompanyId(idCompany)
    }

    const openDeleteModal = (id) => {
        setIdCompany(id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        fetchCompanies();
        setNewCompany({
            id:0,
            companyName: "",
            companyPhoneNumber: "",
            companyAddress: ""
        });
        setErrorMessage([]);
    }

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target
        setNewCompany({ ...newCompany, [name]: value })
    }
    const handleMainUserInputChange = (e) => {
        const { name, value } = e.target;

        const mainAdmin = {
            id: 0,
            user: {
                ...newMainAdmin.user,[name]: value
            },
            company: {
                ...newMainAdmin.company, id:companyId
            }
        };
        setNewMainAdmin(mainAdmin);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await addCompany(newCompany.id,newCompany.companyName,newCompany.companyPhoneNumber,newCompany.companyAddress,newCompany.isCompanyActive,headers)

            if (success !== undefined) {
                setNewCompany({
                    id:0,
                    companyName: "",
                    companyPhoneNumber: "",
                    companyAddress: ""
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

    const handleSaveMainAdmin = async (e) => {
        e.preventDefault()
        setIsSavingAdmin(true)
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
                setErrorMessageAdmin("")
                setIsSavingAdmin(false)

                //Toast
                toast.success("Enregistré avec succès",{
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
                setIsSavingAdmin(false)
            }
        } catch (error) {
            setErrorMessageAdmin(error.response.data.errors)
            setIsSavingAdmin(false)
        }
    }

    const handleDelete = async (e) => {
        setIsDeleting(true);
        try {
            const result = await deleteCompany(idCompany,headers);

            if (result === "") {

                setShowModal(false);
                setIsDeleting(false);
                fetchCompanies();

                //Toast
                toast.success("Supprimer avec succès",{
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

                setShowModal(false);
                setIsDeleting(false);
                fetchCompanies();

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

            setShowModal(false);
            setIsDeleting(false);
            fetchCompanies();

            //Toast
            toast.error("Impossible de Supprimer ce type de vehicule ",{
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
                        <h4>Entreprise</h4>
                        <h6>Gérer des entreprises</h6>
                    </div>
                </div>
                <div className="page-btn">
                    <a
                        onClick={() =>openAddEditModal(1) }
                        className="btn btn-added"
                        data-bs-toggle="modal"
                        data-bs-target="#add-company">
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
                        </svg>Nouvelle entreprise
                    </a>
                </div>
            </div>


            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton title="Liste d'entreprises"/>):(
                            <>
                                <div className="table-top">
                                    <div className="search-set">
                                        <h4>Liste d'entreprises</h4>

                                    </div>

                                    <div className="search-path">
                                        <input
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Chercher une entreprise"
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
                                                        <th>Nº de téléphone</th>
                                                        <th>Admin principal</th>
                                                        <th>Statut</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((company) => {
                                                            return(
                                                                <tr key={company.id}>
                                                                    <td>{company.companyName}</td>
                                                                    <td>{company.companyPhoneNumber}</td>
                                                                    <td>
                                                                        {company.adminName === '' ? (
                                                                            <button
                                                                                onClick={(e) =>  openAddAdminModal(company.id) }
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-main-admin"
                                                                                type="button"
                                                                                className="btn btn-primary">
                                                                                <i className="fas fa-bell me-2"></i>Ajouter un admin
                                                                            </button>
                                                                        ) : (
                                                                            <span>{company.adminName }</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {company.isCompanyActive === true ? (
                                                                            <span className="badge badge-linesuccess">Active</span>
                                                                        ) : (
                                                                            <span className="badges-inactive">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={(e) =>  openAddEditModal(2,company.id,company.companyName,company.companyPhoneNumber,company.companyAddress,company.isCompanyActive) }
                                                                                className="me-2 p-2"
                                                                                href="#"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-company">
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
                                                                            <a
                                                                                onClick={(e)=>openDeleteModal(company.id)}
                                                                                className="confirm-text-updated p-2">

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

            <div className="modal fade" id="add-company">
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
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom de l'entreprise</label>
                                            <input
                                                id="companyName"
                                                name="companyName"
                                                value={newCompany.companyName}
                                                onChange={handleCompanyInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nom de l'entreprise"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nº de téléphone</label>
                                            <input
                                                id="companyPhoneNumber"
                                                name="companyPhoneNumber"
                                                value={newCompany.companyPhoneNumber}
                                                onChange={handleCompanyInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nº de téléphone"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Adresse de l'entreprise</label>
                                            <textarea
                                                id="companyAddress"
                                                name="companyAddress"
                                                value={newCompany.companyAddress}
                                                onChange={handleCompanyInputChange}
                                                className="form-control h-100"
                                                rows="2"
                                                placeholder="Adresse de l'entreprise">

                                            </textarea>
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

            {/*add main admin modal*/}
            <div className="modal fade" id="add-main-admin">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content-momo">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Créer un administrateur principal</h4>
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
                                        errorMessageAdmin.length>0 &&( <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <ul>
                                                {
                                                    errorMessageAdmin.map((key,index)=>{
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

                                        <div className="modal-footer-btn">
                                            <button type="submit" className="btn btn-submit">
                                                {isSavingAdmin && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
            <Modal show={showModal} onHide={() => setShowModal(false)} size="sm" backdrop="static">
                <Modal.Body className="modal-body p-4">
                    <div className="text-center">
                        <i className="dripicons-information h1 text-info"></i>
                        <h4 className="mt-2">Confirmation!</h4>
                        <p className="mt-3">Voulez-vous vraiment supprimer ?.</p>
                        <div className="modal-footer-btn">

                            <button
                                onClick={handleDelete}
                                type="button"
                                className="btn btn-danger">
                                {isDeleting && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Supprimer
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
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

export default Company;