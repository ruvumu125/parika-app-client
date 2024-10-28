import {api} from "./baseUrl";

/* This function adds a new main administrator to the database */
export async function addAdministrator(newMainAdminData,headers) {
    const formData = new FormData()
    for (let key in newMainAdminData) {
        if (typeof newMainAdminData[key] === 'object' && newMainAdminData[key] !== null) {
            for (let innerKey in newMainAdminData[key]) {
                formData.append(`${key}.${innerKey}`, newMainAdminData[key][innerKey]);
            }
        } else {
            formData.append(key, newMainAdminData[key]);
        }
    }


    const response = await api.post("/admins/parking/v1/admins/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all companies from the database */
export async function getMainAdministrators(search,page,headers) {

    const baseUrl ="/admins/parking/v1/admins/main";
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

/* This function gets all companies from the database */
export async function getCompanyAdministrators(companyId,search,page,headers) {

    const baseUrl ="/admins/parking/v1/admins/company/";
    const queryParams = [];
    queryParams.push(`page=0`);
    queryParams.push(`size=10`);
    if (search) {
        queryParams.push(`search=${search}`);
    }
    const constructedUrl = `${baseUrl}${companyId}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl, { headers })
        return response.data
    } catch (error) {
        throw new Error("Error fetching main administrator")
    }
}

/* This function gets a company by the id */
export async function getMainAdministratorById(adminId, headers) {
    try {
        const result = await api.get(`/rooms/room/${adminId}`,{ headers })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching company ${error.message}`)
    }
}