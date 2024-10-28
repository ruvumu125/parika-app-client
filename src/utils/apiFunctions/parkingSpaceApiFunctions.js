import {api} from "./baseUrl";

/* This function adds a new main administrator to the database */
export async function addParkingSpace(newParkingSpaceData,headers) {
    const formData = new FormData()
    for (let key in newParkingSpaceData) {
        if (typeof newParkingSpaceData[key] === 'object' && newParkingSpaceData[key] !== null) {
            for (let innerKey in newParkingSpaceData[key]) {
                formData.append(`${key}.${innerKey}`, newParkingSpaceData[key][innerKey]);
            }
        } else {
            formData.append(key, newParkingSpaceData[key]);
        }
    }


    const response = await api.post("/parking_spaces/parking/v1/parking_spaces/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all companies from the database */
export async function getCompanyParkingSpaces(companyId,search,page,headers) {

    const baseUrl ="/parking_spaces/parking/v1/parking_spaces/company/";
    const queryParams = [];
    queryParams.push(`page=${page}`);
    queryParams.push(`size=10`);
    if (search) {
        queryParams.push(`search=${search}`);
    }
    const constructedUrl = `${baseUrl}${companyId}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl,{ headers })
        return response.data
    } catch (error) {
        throw new Error(`Error fetching parking space ${error.message}`)
    }
}

/* This function gets all companies from the database */
export async function getCompanyParkingSpacesList(companyId,headers) {
    try {
        const response = await api.get(`/parking_spaces/parking/v1/parking_spaces/company-spaces/${companyId}`,{ headers })
        return response.data
    } catch (error) {
        throw new Error(`Error fetching parking space ${error.message}`)
    }
}

export async function getParkingSpacesForCompany(companyId,headers) {
    try {
        const response = await api.get(`/parking_spaces/parking/v1/parking_spaces/company-spaces/${companyId}`,{ headers })
        return response.data
    } catch (error) {
        throw new Error(`Error fetching parking space ${error.message}`)
    }
}

/* This isthe function to delete a vehicule type */
export async function deleteParkingSpace(parkingSpaceId,headers) {

    try {
        const result = await api.delete(`/parking_spaces/parking/v1/parking_spaces/delete/${parkingSpaceId}`, { headers })
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}

