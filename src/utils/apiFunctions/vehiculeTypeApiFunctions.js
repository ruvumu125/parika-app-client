import {api} from "./baseUrl";

/* This function adds a new vehicule type to the database */
export async function addVehiculeType(id,vehiculeTypeName,headers) {
    const formData = new FormData()
    formData.append("id", id)
    formData.append("vehiculeTypeName", vehiculeTypeName)

    const response = await api.post("/vehicle_types/parking/v1/vehicle_types/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all vehicule types from the database */
export async function getAllVehiculeTypes(search,page,headers) {

    const baseUrl ="/vehicle_types/parking/v1/vehicle_types/all";
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

/* This function gets a vehicule type by the id */
export async function getCompanyVehiculeTypes(companyId,headers) {

    try {
        const result = await api.get(`/vehicle_types/parking/v1/vehicle_types/company/${companyId}`,{ headers })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching vehicule type ${error.message}`)
    }
}

/* This function gets a vehicule type by the id */
export async function getVehiculeTypes(headers) {

    try {
        const result = await api.get(`/vehicle_types/parking/v1/vehicle_types/company/`,{ headers })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching vehicule type ${error.message}`)
    }
}

/* This function gets a vehicule type by the id */
export async function getVehiculeTypeById(vehiculeTypeId,headers) {
    try {
        const result = await api.get(`/rooms/room/${vehiculeTypeId}`,{ headers })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching vehicule type ${error.message}`)
    }
}

/* This isthe function to delete a vehicule type */
export async function deleteVehiculeType(vehiculeTypeId,headers) {

    try {
        const result = await api.delete(`/vehicle_types/parking/v1/vehicle_types/delete/${vehiculeTypeId}`, { headers })
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}