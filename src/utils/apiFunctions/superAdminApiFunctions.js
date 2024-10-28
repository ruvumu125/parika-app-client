import {api} from "./baseUrl";

/* This function adds a new super administrator to the database */
export async function addSuperAdministrator(newSuperAdminData,headers) {

    const formData = new FormData()
    for (let key in newSuperAdminData) {
        if (typeof newSuperAdminData[key] === 'object' && newSuperAdminData[key] !== null) {
            for (let innerKey in newSuperAdminData[key]) {
                formData.append(`${key}.${innerKey}`, newSuperAdminData[key][innerKey]);
            }
        } else {
            formData.append(key, newSuperAdminData[key]);
        }
    }

    const response = await api.post("/superadmins/parking/v1/superadmins/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all super admins from the database */
export async function getSuperAdministrators(search,page,headers) {

    const baseUrl ="/superadmins/parking/v1/superadmins/all";
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
        throw new Error("Error fetching main administrator")
    }
}

/* This function gets a company by the id */
export async function getSuperAdministratorById(superAdminId,headers) {
    try {
        const result = await api.get(`/rooms/room/${superAdminId}`,{ headers })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching company ${error.message}`)
    }
}