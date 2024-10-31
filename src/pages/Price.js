import React, {useEffect, useState} from 'react';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {
    addParkingPrice,
    deleteParkingPrice,
    getCompanyParkingPrices
} from "../utils/apiFunctions/parkingPriceApiFunctions";
import {
    addVehiculeType,
    deleteVehiculeType,
    getCompanyVehiculeTypes
} from "../utils/apiFunctions/vehiculeTypeApiFunctions";
import {toast} from "react-toastify";
import {Modal} from "react-bootstrap";
import {useAuth} from "../components/auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import {useGetHeader} from "../components/commons/useGetHeader";
import Cookies from "js-cookie";

const Price = () => {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null)
    const name = 'aucun prix';

    //modal declaration
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState("")

    //saving/update declaration
    const [errorMessage, setErrorMessage] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    //delete declaration
    const [parkingPriceId, setParkingPriceId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    //pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //search
    const [searchTerm, setSearchTerm] = useState('');

    //price declaration
    const token = Cookies.get("jwtToken");
    const companyId=jwtDecode(token).company_id;
    const idCompany = {
        id: companyId
    };
    const [newParkingPrice, setNewParkingPrice] = useState(
        {
            "id": 0,
            "companyDto": idCompany,
            "vehicleTypeDto": {
                "id": 0
            },
            "price": 0
        }
    )

    //selector declaration
    const [vehiculeTypes, setVehiculeTypes] = useState([])
    const [selectedVehiculeTypeId, setSelectedVehiculeTypeId] = useState('')
    const [selectedVehiculeTypeName, setSelectedVehiculeTypeName] = useState("---Sélectionner un type de vehicule---");

    useEffect(() => {
        fetchParkingPrices();
        fetchVehiculeTypes();
        console.log(companyId);
    }, [page,searchTerm]);

    const fetchParkingPrices = () => {

        getCompanyParkingPrices(companyId,searchTerm,page,headers)
            .then((data) => {

                console.log(data.content);
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

    const fetchVehiculeTypes=() => {
        getCompanyVehiculeTypes(companyId,headers)
            .then((data) => {

                console.log(data);
                setVehiculeTypes(data)

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

    const openAddEditModal = (op,id,vehiculeTypeId,vehiculeTypeName,price) => {
        setOperation(op);

        if (op===1){
            setModalTitle("Créer un prix de stationnement ");
        }
        else if (op===2){
            setModalTitle("Modifier le prix de stationnement");
            const parkingPrice = {
                id: id,
                companyDto: idCompany,
                vehicleTypeDto: {
                    ...newParkingPrice.vehicleTypeDto, id:vehiculeTypeId
                },
                price:price
            };
            setNewParkingPrice(parkingPrice);
            setSelectedVehiculeTypeId(vehiculeTypeId);
            setSelectedVehiculeTypeName(vehiculeTypeName);
        }
    }

    const openDeleteModal = (id) => {
        setParkingPriceId(id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        fetchParkingPrices();
        setNewParkingPrice({
            "id": 0,
            "companyDto": idCompany,
            "vehicleTypeDto": {
                "id": 0
            },
            "price": 0
        })
        setErrorMessage([]);
    }

    const handleVehicleTypeChange = (e) => {
        const { value } = e.target;
        setNewParkingPrice(prevState => ({
            ...prevState,
            vehicleTypeDto: {
                id: parseInt(value)
            }
        }));
    };

    const handlePriceInputChange = (e) => {
        const { value } = e.target;
        setNewParkingPrice(prevState => ({
            ...prevState,
            price: parseFloat(value)
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await addParkingPrice(newParkingPrice,headers)

            if (success !== undefined) {
                setNewParkingPrice({
                    "id": 0,
                    "companyDto": idCompany,
                    "vehicleTypeDto": {
                        "id": 0
                    },
                    "price": 0
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
            const result = await deleteParkingPrice(parkingPriceId,headers);

            if (result === "") {

                setShowModal(false);
                setIsDeleting(false);
                fetchParkingPrices();

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
            fetchParkingPrices();

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

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Prix de stationnement</h4>
                        <h6>Gérer des prix de stationnement</h6>
                    </div>
                </div>

                <div className="page-btn">
                    <a
                        onClick={() =>openAddEditModal(1) }
                        className="btn btn-added"
                        data-bs-toggle="modal"
                        data-bs-target="#add-price">
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
                        </svg> Nouveau prix de stationnement
                    </a>
                </div>
            </div>


            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton title="Liste de prix de stationnement"/>):(
                            <>
                                <div className="table-top">
                                    <div className="search-set">
                                        <h4>Liste de prix de stationnement</h4>

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
                                                        <th>Type de vehicule</th>
                                                        <th>Prix par heure</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((vehicule_type_price) => {
                                                            return(
                                                                <tr key={vehicule_type_price.id}>
                                                                    <td>{vehicule_type_price.vehicleType.vehiculeTypeName}</td>
                                                                    <td>{vehicule_type_price.price}</td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={(e) =>  openAddEditModal(2,vehicule_type_price.id,vehicule_type_price.vehicleType.id,vehicule_type_price.vehicleType.vehiculeTypeName,vehicule_type_price.price) }
                                                                                className="me-2 p-2"
                                                                                href="#"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add-price">

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
                                                                                onClick={(e)=>openDeleteModal(vehicule_type_price.id)}
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

            { isNoDataFound && <NoDataFound name={name}/>}

            <div className="modal fade" id="add-price">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content-momo">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>{modalTitle}</h4>
                                    </div>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
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
                                    <form  onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <div className="form-group">
                                                <label className="form-label">Type de vehicule</label>
                                                <select
                                                    id="id"
                                                    name="id"
                                                    className="form-select"
                                                    value={newParkingPrice.vehicleTypeDto.id}
                                                    onChange={handleVehicleTypeChange}>
                                                    <option value={selectedVehiculeTypeId}>{selectedVehiculeTypeName}</option>
                                                    {
                                                        operation === 1 ? (
                                                            vehiculeTypes.map((vehicule_type) => (
                                                                <option
                                                                    key={vehicule_type.id}
                                                                    value={vehicule_type.id}>{vehicule_type.vehiculeTypeName
                                                                }</option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )

                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Prix par heure</label>
                                            <input
                                                id="price"
                                                name="price"
                                                value={newParkingPrice.price}
                                                onChange={handlePriceInputChange}
                                                type="number"
                                                className="form-control"
                                                placeholder="Prix par heure"/>
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

export default Price;