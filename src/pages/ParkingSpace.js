import React, {useEffect, useState} from 'react';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {
    addParkingSpace,
    deleteParkingSpace,
    getCompanyParkingSpaces
} from "../utils/apiFunctions/parkingSpaceApiFunctions";
import {toast} from "react-toastify";
import {Modal} from "react-bootstrap";
import {deleteParkingPrice} from "../utils/apiFunctions/parkingPriceApiFunctions";
import {useAuth} from "../components/auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import {useGetHeader} from "../components/commons/useGetHeader";
import Cookies from "js-cookie";

const ParkingSpace = () => {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null)
    const name = 'aucun espace de stationnement ';

    //modal declaration
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState("")

    //saving/update declaration
    const [errorMessage, setErrorMessage] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    //delete declaration
    const [parkingSpaceId, setParkingSpaceId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    //pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //search
    const [searchTerm, setSearchTerm] = useState('');

    //parking space declaration
    const token = Cookies.get("jwtToken");
    const companyId=jwtDecode(token).company_id;
    const idCompany = {
        id: companyId
    };
    const [newParkingSpace, setNewParkingSpace] = useState({
        "id": 0,
        "name": "",
        "location": "",
        "company":idCompany
    })

    useEffect(() => {
        fetchCompanyParkingSpaces();
    }, [page,searchTerm]);

    const fetchCompanyParkingSpaces = () => {

        getCompanyParkingSpaces(companyId,searchTerm,page,headers)
            .then((data) => {

                console.log(data);
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

    const openAddEditModal = (op,id,name,location) => {
        setOperation(op);

        if (op===1){
            setModalTitle("Créer une espace de stationnement  ");
        }
        else if (op===2){
            setModalTitle("Modifier l'espace de stationnement");
            const parkingSpace = {
                id: id,
                name:name,
                location:location,
                company:idCompany
            };
            setNewParkingSpace(parkingSpace);
        }
    }

    const openDeleteModal = (id) => {
        setParkingSpaceId(id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        fetchCompanyParkingSpaces();
        setNewParkingSpace({
            "id": 0,
            "name": "",
            "location": "",
            "company":idCompany
        })
        setErrorMessage([]);
    }

    const handleParkingSpaceInputChange = (e) => {
        const { name, value } = e.target;

        const parkingSpace = prevState => ({
            ...prevState,
            [name]: value
        });
        setNewParkingSpace(parkingSpace);
    }

    const handleSaveParkingSpace = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await addParkingSpace(newParkingSpace,headers)

            if (success !== undefined) {
                setNewParkingSpace({
                    "id": 0,
                    "name": "",
                    "location": "",
                    "company":idCompany
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

    const handleDelete = async (e) => {
        setIsDeleting(true);
        try {
            const result = await deleteParkingSpace(parkingSpaceId,headers);

            if (result === "") {

                setShowModal(false);
                setIsDeleting(false);
                fetchCompanyParkingSpaces();

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
                console.error(`Error deleting room : ${result.message}`)
                alert("noooo");
            }
        } catch (error) {

            setShowModal(false);
            setIsDeleting(false);
            fetchCompanyParkingSpaces();

            //Toast
            toast.error("Impossible de Supprimer cette espace de parking ",{
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
                        <h4>Espace de stationnement</h4>
                        <h6>Gérer des espaces de stationnement</h6>
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
                        data-bs-target="#add-parking-space">
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
                                                        <th>Adresse</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((parking_space) => {
                                                            return(
                                                                <tr key={parking_space.id}>
                                                                    <td>{parking_space.name}</td>
                                                                    <td>{parking_space.location}</td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={(e) =>  openAddEditModal(
                                                                                    2,
                                                                                    parking_space.id,
                                                                                    parking_space.name,
                                                                                    parking_space.location)
                                                                                }
                                                                                className="me-2 p-2"
                                                                                href="#"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-parking-space">
                                                                                <i data-feather="edit" className="feather-edit"></i>
                                                                            </a>
                                                                            <a
                                                                                onClick={(e)=>openDeleteModal(parking_space.id)}
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

            <div className="modal fade" id="add-parking-space">
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
                                    <form onSubmit={handleSaveParkingSpace} >

                                        <div className="mb-3">
                                            <label className="form-label">Nom</label>
                                            <input
                                                id="name"
                                                name="name"
                                                value={newParkingSpace.name}
                                                onChange={handleParkingSpaceInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nom"/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Adresse</label>
                                            <textarea
                                                id="location"
                                                name="location"
                                                value={newParkingSpace.location}
                                                onChange={handleParkingSpaceInputChange}
                                                className="form-control h-100"
                                                rows="2" placeholder="Adresse"></textarea>
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
            <Modal show={showModal} onHide={() => setShowModal(false)} size="sm">
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

export default ParkingSpace;