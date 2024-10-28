import {api} from "./baseUrl";

/* This function adds a new vehicule type to the database */
export async function updateVehicule(newVehiculeData,headers) {
    const formData = new FormData()
    for (let key in newVehiculeData) {
        if (typeof newVehiculeData[key] === 'object' && newVehiculeData[key] !== null) {
            for (let innerKey in newVehiculeData[key]) {
                formData.append(`${key}.${innerKey}`, newVehiculeData[key][innerKey]);
            }
        } else {
            formData.append(key, newVehiculeData[key]);
        }
    }

    const response = await api.post("/vehicles/parking/v1/vehicles/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all vehicule types from the database */
export async function getAllVehicule(search,page,headers) {

    const baseUrl ="/vehicles/parking/v1/vehicles/all";
    const queryParams = [];
    queryParams.push(`page=${page}`);
    queryParams.push(`size=10`);
    if (search) {
        queryParams.push(`search=${search}`);
    }
    const constructedUrl = `${baseUrl}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl,{ headers })
        return response.data
    } catch (error) {
        throw new Error("Error fetching vehicule types")
    }
}

export async function getVehiculeDetails(vehiculeId,headers) {

    try {
        const result = await api.get(`/vehicles/parking/v1/vehicles/all-details/${vehiculeId}`,{ headers })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching vehicule type ${error.message}`)
    }
}