import React, {useEffect, useState} from 'react';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {addSuperAdministrator, getSuperAdministrators} from "../utils/apiFunctions/superAdminApiFunctions";
import {toast} from "react-toastify";
import {Modal} from "react-bootstrap";
import {desableUser, enableUser} from "../utils/apiFunctions/userApiFunctions";
import {useGetHeader} from "../components/commons/useGetHeader";

const SuperAdmin = () => {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null)
    const [checkedItems, setCheckedItems] = useState({});
    const name = 'aucun super administrateur ';

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
    const [isActivatingSuperAdmin, setIsActivatingSuperAdmin] = useState(false);
    const openActivateModal = (id) => {
        setuserId(id);
        setShowActivateModal(true);
    }

    //desable admin modal declaration
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [isDisablingSuperAdmin, setIsDisablingSuperAdmin] = useState(false);
    const openDisableModal = (id) => {
        setuserId(id);
        setShowDisableModal(true);
    }

    //admin principal declaration
    const [newSuperAdmin, setNewSuperAdmin] = useState(
        {
            "id": 0,
            "user": {
                "id": 0,
                "userFullName": "",
                "userEmail": "",
                "userPhoneNumber": "",
                "isUserActive": true
            }
        }
    );

    useEffect(() => {
        fetchSuperAdmins();
    }, [page,searchTerm]);

    const fetchSuperAdmins = () => {

        const initialCheckedItems = {};

        getSuperAdministrators(searchTerm,page, headers)
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
            setModalTitle("Créer un super-administrateur ");
        }
        else if (op===2){
            setModalTitle("Modifier le super-administrateur");
            const superAdmin = {
                id: id,
                user: {
                    ...newSuperAdmin.user,
                    id: userId,
                    userFullName:userFullName,
                    userEmail:userEmail,
                    userPhoneNumber: userPhoneNumber,
                    isUserActive: isUserActive

                }
            };
            setNewSuperAdmin(superAdmin);
        }
    }

    const handleCloseModal = () => {
        fetchSuperAdmins();
        setNewSuperAdmin({
            "id": 0,
            "user": {
                "id": 0,
                "userFullName": "",
                "userEmail": "",
                "userPhoneNumber": "",
                "isUserActive": true
            }
        })
        setErrorMessage([]);
    }

    const handleSuperAdminInputChange = (e) => {
        const { name, value } = e.target;

        const mainAdmin = {
            id: 0,
            user: {
                ...newSuperAdmin.user,[name]: value
            }
        };
        setNewSuperAdmin(mainAdmin);
    }

    const handleSaveSuperAdmin = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await addSuperAdministrator(newSuperAdmin,headers)

            if (success !== undefined) {
                setNewSuperAdmin({
                    "id": 0,
                    "user": {
                        "id": 0,
                        "userFullName": "",
                        "userEmail": "",
                        "userPhoneNumber": "",
                        "isUserActive": true
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

        if (statut===true){
            openActivateModal(id);
        }
        else{
            openDisableModal(id);
        }
    }

    const handleActivateSuperAdmin = async (e) => {
        setIsActivatingSuperAdmin(true);
        try {
            const result = await enableUser(userId, headers);

            if (result.status === 200) {

                setShowActivateModal(false);
                setIsActivatingSuperAdmin(false);
                fetchSuperAdmins();

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
                setIsActivatingSuperAdmin(false);
                fetchSuperAdmins();

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
            setIsActivatingSuperAdmin(false);
            fetchSuperAdmins();

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

    const handleDesableSuperAdmin = async (e) => {
        setIsDisablingSuperAdmin(true);
        try {
            const result = await desableUser(userId,headers);

            if (result.status === 200) {

                setShowDisableModal(false);
                setIsDisablingSuperAdmin(false);
                fetchSuperAdmins();

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
                setIsDisablingSuperAdmin(false);
                fetchSuperAdmins();

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
            setIsDisablingSuperAdmin(false);
            fetchSuperAdmins();

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
                        <h4>Super administrateur</h4>
                        <h6>Gérer des super administrateur</h6>
                    </div>
                </div>
                <ul className="table-top-head">
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="/img/pdf.svg" alt="img"/></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="/img/excel.svg" alt="img"/></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print"><i data-feather="printer" className="feather-rotate-ccw"></i></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i data-feather="rotate-ccw" className="feather-rotate-ccw"></i></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i data-feather="chevron-up" className="feather-chevron-up"></i></a>
                    </li>
                </ul>
                <div className="page-btn">
                    <a
                        onClick={() =>openAddEditModal(1) }
                        className="btn btn-added"
                        data-bs-toggle="modal"
                        data-bs-target="#add-super-admin">
                        <i data-feather="plus-circle" className="me-2"></i>Add New Category
                    </a>
                </div>
            </div>


            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton/>):(
                            <>
                                <div className="table-top">
                                    <div className="search-set">
                                        <h4>Liste des super administrateurs</h4>

                                    </div>
                                    <div className="search-path">
                                        <input
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Rechercher une espace de stationnement"
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
                                                        <th>Activer/Desact</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((super_admin) => {
                                                            return(
                                                                <tr key={super_admin.user.id}>
                                                                    <td>{super_admin.user.userFullName}</td>
                                                                    <td>{super_admin.user.userEmail}</td>
                                                                    <td>{super_admin.user.userPhoneNumber}</td>
                                                                    <td>
                                                                        {super_admin.user.isUserActive === true ? (
                                                                            <span className="badge badge-linesuccess">Active</span>
                                                                        ) : (
                                                                            <span className="badges-inactive">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <label className="checkboxs">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checkedItems[super_admin.user.id] || false}
                                                                                onChange={() => handleCheckboxChange(super_admin.user.id)}
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
                                                                                href=""
                                                                                onClick={(e) =>  openAddEditModal(
                                                                                    2,
                                                                                    super_admin.id,
                                                                                    super_admin.user.id,
                                                                                    super_admin.user.userFullName,
                                                                                    super_admin.user.userEmail,
                                                                                    super_admin.user.userPhoneNumber,
                                                                                    super_admin.user.isUserActive)
                                                                                }
                                                                                className="me-2 p-2"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-super-admin">
                                                                                <i data-feather="edit" className="feather-edit"></i>
                                                                            </a>
                                                                            <a href="" className="confirm-text-updated p-2" data-bs-toggle="modal" data-bs-target="#info-alert-modal">
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

            <div className="modal fade" id="add-super-admin">
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
                                    <form onSubmit={handleSaveSuperAdmin}>

                                        <div className="mb-3">
                                            <label className="form-label">Nom complet de l'utilisateur</label>
                                            <input
                                                id="userFullName"
                                                name="userFullName"
                                                value={newSuperAdmin.user.userFullName}
                                                onChange={handleSuperAdminInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nom complet de l'utilisateur"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Adresse e-mail de l'utilisateur</label>
                                            <input
                                                id="userEmail"
                                                name="userEmail"
                                                value={newSuperAdmin.user.userEmail}
                                                onChange={handleSuperAdminInputChange}
                                                className="form-control h-100"
                                                type="text"
                                                placeholder="Adresse e-mail de l'utilisateur"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nº de téléphone de l'utilisateur</label>
                                            <input
                                                id="userPhoneNumber"
                                                name="userPhoneNumber"
                                                value={newSuperAdmin.user.userPhoneNumber}
                                                onChange={handleSuperAdminInputChange}
                                                type="number"
                                                className="form-control"
                                                placeholder="Nº de téléphone de l'utilisateur"/>
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
                                onClick={handleActivateSuperAdmin}
                                type="button"
                                className="btn btn-danger">
                                {isActivatingSuperAdmin && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
                                onClick={handleDesableSuperAdmin}
                                type="button"
                                className="btn btn-danger">
                                {isDisablingSuperAdmin && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
export default SuperAdmin;