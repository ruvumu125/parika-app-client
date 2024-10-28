import {api} from "./baseUrl";

/* This function adds a new main administrator to the database */
export async function addParkingPrice(newParkingPriceData,headers) {
    const formData = new FormData()
    for (let key in newParkingPriceData) {
        if (typeof newParkingPriceData[key] === 'object' && newParkingPriceData[key] !== null) {
            for (let innerKey in newParkingPriceData[key]) {
                formData.append(`${key}.${innerKey}`, newParkingPriceData[key][innerKey]);
            }
        } else {
            formData.append(key, newParkingPriceData[key]);
        }
    }


    const response = await api.post("/parking_prices/parking/v1/parking_prices/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all companies from the database */
export async function getCompanyParkingPrices(companyId,search,page,headers) {

    const baseUrl ="/parking_prices/parking/v1/parking_prices/company/";
    const queryParams = [];
    queryParams.push(`page=${page}`);
    queryParams.push(`size=10`);
    if (search) {
        queryParams.push(`search=${search}`);
    }
    const constructedUrl = `${baseUrl}${companyId}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl, { headers })
        return response.data
    } catch (error) {
        throw new Error(`Error fetching parking price ${error.message}`)
    }
}

/* This isthe function to delete a vehicule type */
export async function deleteParkingPrice(parkingPriceId,headers) {

    try {
        const result = await api.delete(`/parking_prices/parking/v1/parking_prices/delete/${parkingPriceId}`, { headers })
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}
