import React, {useEffect, useRef, useState} from 'react';
import ListSkleton from "../components/commons/ListSkleton";
import Pagination from "../components/commons/Pagination";
import NoDataFound from "../components/commons/NoDataFound";
import {ToastContainer, toast, Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getAllVehicule, getVehiculeDetails, updateVehicule} from "../utils/apiFunctions/vehiculeFunctions";
import {getVehiculeTypes} from "../utils/apiFunctions/vehiculeTypeApiFunctions";
import moment from "moment";
import 'moment/locale/fr';
import {useGetHeader} from "../components/commons/useGetHeader";  // Importer la locale française

moment.locale('fr');  // Set the locale globally to French


const VehiculeType = () => {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null)
    const name = 'aucun vehicule';

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

    const [newVehicule, setNewVehicule] = useState(
        {
            id: 0,
            registrationNumber: "",
            vehicleType: {
                "id": 0
            }
        }
    )

    //selector declaration
    const [vehiculeTypes, setVehiculeTypes] = useState([]);
    const [selectedVehiculeTypeId, setSelectedVehiculeTypeId] = useState('');
    const [selectedVehiculeTypeName, setSelectedVehiculeTypeName] = useState("---Sélectionner un type de vehicule---");

    useEffect(() => {
        fetchVehicules();
        //fetchAllVehiculeTypes();
    }, [page,searchTerm]);

    const fetchVehicules = () => {

        getAllVehicule (searchTerm,page,headers)
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

    const fetchAllVehiculeTypes=() => {
        getVehiculeTypes(headers)
            .then((data) => {
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

    const openAddEditModal = (op,id,registrationNumber,vehicleTypeId) => {
        setOperation(op);

        if (op===1){
            setModalTitle("Créer un type de vehicule");
        }
        else if (op===2){
            setModalTitle("Modifier le type de vehicule");
            const vehicule = {
                id: id,
                registrationNumber: registrationNumber,
                vehicleType: {
                    ...newVehicule.vehicleType, id:vehicleTypeId
                },
            };
            setNewVehicule(vehicule)
        }
    }

    const handleCloseModal = () => {
        fetchVehicules();
        setNewVehicule({
            id: 0,
            registrationNumber: "",
            vehicleType: {
                "id": 0
            }
        })
        setErrorMessage([]);
    }

    const handleVehiculeInputChange = (e) => {
        const { name, value } = e.target;

        const vehicule = {

            ...newVehicule,[name]: value,
            vehicleType: {
                ...newVehicule.vehicleType,[name]: value
            }
        };
        setNewVehicule(vehicule);
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const success = await updateVehicule(newVehicule,headers)

            if (success !== undefined) {
                setNewVehicule({
                    id: 0,
                    registrationNumber: "",
                    vehicleType: {
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

    //vehicule details modal
    const [vehiculeDetails, setVehiculeDetails] = useState([]);
    const [isLoadingVehiculeDetails, setIsLoadingVehiculeDetails] = useState(true);
    const [saleModalTitle, setSaleModalTitle] = useState('');
    const openVehiculeDetailsModal = (id,plateNumber) => {
        setSaleModalTitle("Détails du vehicule N° "+plateNumber);
        alert(id);
        fetchSaleDetails(id);
    }
    const fetchSaleDetails=(idVehicule) => {
        getVehiculeDetails(idVehicule,headers)
            .then((data) => {
                console.log(data);
                setVehiculeDetails(data)
                isLoadingVehiculeDetails(false);

            })
            .catch((error) => {
                isLoadingVehiculeDetails(false)
            })
    };

    const openVehiculeDetails = (vehiculeData) => {
        const url = `/paul`; // Your target URL
        const params = new URLSearchParams({ vehiculeData: JSON.stringify(vehiculeData) }).toString();
        window.open(`${url}?${params}`, '_blank');
    };

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Véhicule</h4>
                        <h6>Gérer des véhicules</h6>
                    </div>
                </div>
            </div>


            <div className="card table-list-card">
                <div className="card-body">

                    {/*skeleton*/}
                    {isLoading && <ListSkleton title="Liste de véhicules"/>}
                    {/*skeleton*/}

                    {/*list section*/}
                    {
                        isDataFound && (<><div className="table-top">
                            <div className="search-set">
                                <h4>Liste de véhicules</h4>

                            </div>
                            <div className="search-path">
                                <input
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Rechercher type de vehicule"
                                    type="text" className="form-control"/>
                            </div>

                        </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Nº d'immatriculation</th>
                                        <th>Type de vehicule</th>
                                        <th>Numéro de compte</th>
                                        <th>Solde du compte</th>
                                        <th>Date de création</th>
                                        <th className="no-sort">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        data.map((vehicule_type) => {

                                            const date=moment(vehicule_type.creationDate).format('LLLL');
                                            return(
                                                <tr key={vehicule_type.idVehicle}>
                                                    <td>{vehicule_type.registrationNumber}</td>
                                                    <td>{vehicule_type.vehicleType.vehiculeTypeName}</td>
                                                    <td>{vehicule_type.accountNumber}</td>
                                                    <td>{vehicule_type.solde}</td>
                                                    <td>{date}</td>
                                                    <td className="text-center">
                                                        <a className="action-set" href="javascript:void(0);" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                        </a>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <a
                                                                    onClick={(e) =>  openAddEditModal(2,vehicule_type.id,vehicule_type.registrationNumber,vehicule_type.vehicleType.vehiculeTypeName) }
                                                                    className="dropdown-item"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#sales-details-new">
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
                                                                        className="feather feather-edit info-img">
                                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                    </svg>Modifier le véhicule
                                                                </a>
                                                            </li>

                                                            <li>
                                                                <a
                                                                    onClick={() =>
                                                                        openVehiculeDetails(vehicule_type)
                                                                    }
                                                                    className="dropdown-item">
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
                                                                        className="feather feather-download info-img">
                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                    </svg>Imprimer la carte
                                                                </a>
                                                            </li>
                                                        </ul>
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
                            </div></>)
                    }

                    {/*list section*/}


                </div>
            </div>

            { isNoDataFound && <NoDataFound name={name}/>}

            <div className="modal fade" id="add-vehicule-type" data-bs-backdrop="static" data-bs-keyboard="false">
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
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nom du type de vehicule</label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control"
                                                placeholder="Nom du type de vehicule"
                                                id="vehiculeTypeName"
                                                name="vehiculeTypeName"
                                                value={newVehicule.registrationNumber}
                                                onChange={handleVehiculeInputChange}
                                            />
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

            <div className="modal fade" id="vehicule-details-new">
                <div className="modal-dialog modal-sm modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content-momo">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>{saleModalTitle} </h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">

                                    <ListSkleton/>

                                    <div className="row">
                                        <table className="table table-responsive table-borderless">
                                            <tr>
                                                <td>Sub Total</td>
                                                <td className="text-end">$60,454</td>
                                            </tr>
                                            <tr>
                                                <td>Tax (GST 5%)</td>
                                                <td className="text-end">$40.21</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping</td>
                                                <td class="text-end">$40.21</td>
                                            </tr>
                                            <tr>
                                                <td>Sub Total</td>
                                                <td class="text-end">$60,454</td>
                                            </tr>
                                            <tr>
                                                <td class="danger">Discount (10%)</td>
                                                <td class="danger text-end">$15.21</td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td class="text-end">$64,024.5</td>
                                            </tr>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </React.Fragment>
    );
}

export default VehiculeType;