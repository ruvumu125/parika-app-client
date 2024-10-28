import React, {useEffect, useState} from 'react';
import moment from "moment";
import ListSkletonCollections from "../components/commons/ListSkletonCollections";
import ListSkletonModal from "../components/commons/ListSkletonModal";
import ListSkletonTable from "../components/commons/ListSkletonTable";
import {getParkingSpacesForCompany} from "../utils/apiFunctions/parkingSpaceApiFunctions";
import DateTime from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import {getCompanyAgent} from "../utils/apiFunctions/agentApiFunctions";
import {getCompanyCollections} from "../utils/apiFunctions/collectionApiFunctions";
import NoDataFound from "../components/commons/NoDataFound";
import Pagination from "../components/commons/Pagination";
import {useAuth} from "../components/auth/AuthContext";
import {jwtDecode} from "jwt-decode";
import {useGetHeader} from "../components/commons/useGetHeader";
import Cookies from "js-cookie";

function Collections() {

    //listing declaration
    const headers = useGetHeader(); // Use the custom hook to get headers
    const [data, setData] = useState([]);
    const [isDefaultLoading, setIsDefaultLoading] = useState(true);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null);
    const [collectionGeneralTotal, setCollectionGeneralTotal] = useState(0);
    const [tableTitle, setTableTitle] = useState("Perception des frais de parking aujourd'hui");
    const name = 'aucune collection';

    //date start and end filter
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    //pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //selector declaration
    const [companyParkingSpaces, setCompanyParkingSpaces] = useState([]);
    const [companyAgents, setCompanyAgents] = useState([]);
    const [newParkingSpace, setNewParkingSpace] = useState({
        "id": 0,
        "name": ""
    });
    const [newAgent, setNewAgent] = useState({
        "id": 0,
        "userFullName": ""
    })

    const handleParkingSpaceSelectChange = (e) => {
        const selectedId = e.target.value;

        // Check if the selected option is the first one (i.e., no parking space is selected)
        if (selectedId === "") {
            setNewParkingSpace({
                id: 0,
                name: ""
            });
            return; // Exit the function early if no valid parking space is selected
        }

        // Find the selected parking space by id
        const selectedParkingSpace = companyParkingSpaces.find(
            (space) => space.id === parseInt(selectedId)
        );

        if (selectedParkingSpace) {
            // Update both id and name in the state
            setNewParkingSpace({
                id: selectedParkingSpace.id,
                name: selectedParkingSpace.name
            });
        }
    };

    const handleAgentSelectChange = (e) => {
        const selectedId = e.target.value;

        // Check if the selected option is the first one (i.e., no parking space is selected)
        if (selectedId === "") {
            setNewAgent({
                id: 0,
                userFullName: ""
            });
            return; // Exit the function early if no valid parking space is selected
        }

        // Find the selected parking space by id
        const selectedAgent = companyAgents.find(
            (agent) => agent.id === parseInt(selectedId)
        );

        if (selectedAgent) {
            // Update both id and name in the state
            setNewAgent({
                id: selectedAgent.id,
                userFullName: selectedAgent.user.userFullName
            });
        }
    };

    const [isKobwiVisible, setKobwiVisible] = useState(false);

    // Function to toggle the visibility of the kobwi div
    const handleToggle = () => {
        setKobwiVisible(prevState => !prevState);
        setIsClicked(!isClicked);
    };

    const token = Cookies.get("jwtToken");
    const companyId=jwtDecode(token).company_id;

    useEffect(() => {
        fetchCompanyParkingSpaces();
        fetchCompanyAgents();
        fetchCompanyCollections();

    }, [companyId]);

    const fetchCompanyParkingSpaces=() => {
        getParkingSpacesForCompany(companyId,headers)
            .then((data) => {
                setCompanyParkingSpaces(data);

            })
            .catch((error) => {
            })
    };

    const fetchCompanyAgents=() => {
        getCompanyAgent(companyId, headers)
            .then((data) => {
                setCompanyAgents(data);

            })
            .catch((error) => {
            })
    };

    //date start and end filter
    const disableFutureDates = (current) => {
        return current.isBefore(moment().endOf('day'));
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleStartDateChange = (date) => {
        if (date && date._isAMomentObject) {
            const formattedDate = date.format('YYYY-MM-DD');
            setStartDate(formattedDate);
        }
    }
    const handleEndDateChange = (date) => {
        if (date && date._isAMomentObject) {
            const formattedDate = date.format('YYYY-MM-DD');
            setEndDate(formattedDate);
        }
    };

    const fetchCompanyCollections = () => {

        getCompanyCollections(companyId,newParkingSpace.id,newAgent.id,startDate,endDate,page,headers)
            .then((data) => {

                setTotalPages(data.transactions.totalPages);
                setData(data.transactions.content)
                setCollectionGeneralTotal(data.totalAmount);
                setIsDefaultLoading(false)
                setIsSearchLoading(false)
                setIsDataFound(true)


            })
            .catch((error) => {
                setFetchingError(error.message)
                setIsDefaultLoading(false)
                setIsSearchLoading(false)
            })

    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    function handleSearch() {

        setIsDefaultLoading(false);
        setIsSearchLoading(true);
        fetchCompanyCollections();
        // ggggggggg
        if (!(endDate==='' && startDate ==='') && newParkingSpace.id === 0 && newAgent.id === 0) {
            if (startDate===endDate){
                setTableTitle("Perception des frais de parking au "+formatDate(startDate));
            }
            else{
                setTableTitle("Perception des frais de parking entre "+formatDate(startDate)+" et "+formatDate(endDate));
            }

        } else if (!(endDate==='' && startDate ==='') && newParkingSpace.id > 0 && newAgent.id === 0) {
            if (startDate===endDate){
                setTableTitle("Perception des frais de parking au "+formatDate(startDate)+ " au "+newParkingSpace.name);
            }
            else{
                setTableTitle("Perception des frais de parking entre "+formatDate(startDate)+" et "+formatDate(endDate)+ "au "+newParkingSpace.name);
            }
        } else if (!(endDate==='' && startDate ==='') && newParkingSpace.id === 0 && newAgent.id > 0) {
            if (startDate===endDate){
                setTableTitle("Perception des frais de parking au "+formatDate(startDate)+ " par "+newAgent.userFullName);
            }
            else{
                setTableTitle("Perception des frais de parking entre "+formatDate(startDate)+" et "+formatDate(endDate)+ " par "+newAgent.userFullName);
            }
        } else if (!(endDate==='' && startDate ==='') && newParkingSpace.id > 0 && newAgent.id > 0) {

            if (startDate===endDate){
                setTableTitle("Perception des frais de parking au "+formatDate(startDate)+ "par "+newAgent.userFullName+ " au "+newParkingSpace.name);
            }
            else{
                setTableTitle("Perception des frais de parking entre "+formatDate(startDate)+" et "+formatDate(endDate)+ "par "+newAgent.userFullName+ " au "+newParkingSpace.name);
            }
        } else if ((endDate==='' && startDate ==='') && newParkingSpace.id === 0 && newAgent.id === 0) {
            setTableTitle("Perception des frais de parking aujourd'hui");
        } else if ((endDate==='' && startDate ==='') && newParkingSpace.id > 0 && newAgent.id === 0) {
            setTableTitle("Perception des frais de parking au "+newParkingSpace.name);
        } else if ((endDate==='' && startDate ==='') && newParkingSpace.id === 0 && newAgent.id > 0) {
            setTableTitle("Perception des frais de parking au "+newAgent.userFullName);
        } else if ((endDate==='' && startDate ==='') && newParkingSpace.id > 0 && newAgent.id > 0) {
            setTableTitle("Perception des frais de parking au "+newParkingSpace.name+ " par "+newAgent.userFullName);
        } else {
            setTableTitle("Perception des frais de parking aujourd'hui");
        }
        // kkkkkkkkk

    }

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Employees</h4>
                        <h6>Manage your employees</h6>
                    </div>
                </div>
                <ul className="table-top-head">
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img"/></a>
                    </li>
                    <li>
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img"/></a>
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

            </div>

            <div className="card table-list-card">
                <div className="card-body pb-0">

                    {isDefaultLoading ? <ListSkletonCollections /> : null}

                    {!isDefaultLoading ?  <>
                        <div className="table-top" style={{display:"block"}}>

                            <div className="row">
                                <div className="col-lg-3" style={{paddingTop:5}}>
                                    <div className="total-employees">
                                        <h6>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="feather feather-arrow-up">
                                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                                <polyline points="5 12 12 5 19 12"></polyline>
                                            </svg>Total : {collectionGeneralTotal} </h6>
                                    </div>
                                </div>
                                <div className="col-lg-8" style={{paddingTop:5}}>
                                    <div className="total-employees">
                                        <h6>{tableTitle}</h6>
                                    </div>
                                </div>
                                <div className="col-lg-1" style={{paddingTop:5}}>
                                    <div className="d-flex align-items-center">
                                        <a
                                            className="btn btn-filter"
                                            onClick={handleToggle}
                                            style={{
                                                background: isClicked
                                                    ? "red"   // Change to red if clicked
                                                    : isHovered
                                                        ? "#1B2850" // Change to dark blue when hovered
                                                        : "#FF9F43", // Default color
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: 0,
                                                marginRight: 15,
                                                transition: "background-color 0.3s ease" // Smooth transition
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}  // Handle hover enter
                                            onMouseLeave={() => setIsHovered(false)} // Handle hover leave
                                        >
                                            {isClicked ? (
                                                // Change SVG when clicked
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                                                    <path fill="white" d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                                                </svg>


                                            ) : (
                                                // Default SVG when not clicked
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                                </svg>
                                            )}
                                        </a>

                                    </div>

                                </div>
                            </div>
                        </div>

                        {isKobwiVisible && <div className="table-top" style={{paddingTop:0,marginTop:0}}>
                            <div className="row">

                                <div className="col-lg-3" style={{paddingTop:5}}>
                                    <select
                                        id="id"
                                        name="id"
                                        className="form-select"
                                        value={newParkingSpace.id}
                                        onChange={handleParkingSpaceSelectChange}>
                                        <option value="">--- Sélectionnez parking space---</option>
                                        {
                                            companyParkingSpaces.map((parking_space, index) => (
                                                <option
                                                    key={index}
                                                    value={parking_space.id}
                                                >{parking_space.name}</option>                                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="col-lg-3" style={{paddingTop:5}}>
                                    <select
                                        id="id"
                                        name="id"
                                        className="form-select"
                                        value={newAgent.id}
                                        onChange={handleAgentSelectChange}>
                                        <option value="">--- Sélectionnez un agent---</option>
                                        {
                                            companyAgents.map((agent, index) => (
                                                <option
                                                    key={index}
                                                    value={agent.id}
                                                >{agent.user.userFullName}</option>                                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="col-lg-2" style={{paddingTop:5}}>
                                    <DateTime
                                        closeOnSelect={true}
                                        value={startDate ? moment(startDate).format("DD/MM/YYYY") : null}
                                        onChange={handleStartDateChange}
                                        locale="fr"
                                        dateFormat="DD/MM/YYYY"
                                        inputProps={{ placeholder: "Choisissez une date de début" }}
                                        isValidDate={disableFutureDates}
                                    />
                                </div>
                                <div className="col-lg-2" style={{paddingTop:5}}>
                                    <DateTime
                                        closeOnSelect={true}
                                        value={endDate ? moment(endDate).format("DD/MM/YYYY") : null}
                                        onChange={handleEndDateChange}
                                        locale="fr"
                                        dateFormat="DD/MM/YYYY"
                                        inputProps={{ placeholder: "Choisissez une date de fin" }}
                                        isValidDate={disableFutureDates}
                                    />
                                </div>
                                <div className="col-lg-2" style={{paddingTop:5}} onClick={handleSearch}>
                                    <div className="input-blocks" style={{paddingLeft:0,marginLeft:0}}>
                                        <a className="btn btn-filters ms-auto"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Search </a>
                                    </div>
                                </div>
                            </div>
                        </div>}

                        <div className="table-responsive">
                            {
                                data.length===0 ?(
                                    <>
                                        {!isSearchLoading ?<NoDataFound name={name}/>: null}
                                        {isSearchLoading ? <ListSkletonTable/>: null}
                                    </>
                                ):(
                                    <>
                                        {
                                            isSearchLoading ?(
                                                <>
                                                    <ListSkletonTable/>
                                                </>

                                            ):(
                                                <>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th>Transaction code</th>
                                                            <th>Date</th>
                                                            <th>Montant</th>
                                                            <th>Vehicule</th>
                                                            <th className="no-sort">Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            data.map((collection) => {

                                                                const date=moment(collection.transactionDate).format('Do MMMM YYYY, HH:mm:ss');
                                                                return(
                                                                    <tr key={collection.id}>
                                                                        <td>{collection.transactionCode}</td>
                                                                        <td>{date}</td>
                                                                        <td>{collection.transactionAmount}</td>
                                                                        <td>{collection.account.vehicle.registrationNumber}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                    <br/>
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
                    </> : null}



                </div>
            </div>

        </React.Fragment>
    );
}

export default Collections;