import {api} from "./baseUrl";

/* This function adds a new company to the database */
export async function addCompany(id,companyName,companyPhoneNumber,companyAddress,isCompanyActive,headers) {
    const formData = new FormData()
    formData.append("id", id)
    formData.append("companyName", companyName)
    formData.append("companyPhoneNumber", companyPhoneNumber)
    formData.append("companyAddress", companyAddress)
    formData.append("isCompanyActive", isCompanyActive)

    const response = await api.post("/companies/parking/v1/companies/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all companies from the database */
export async function getAllCompanies(search,page,headers) {

    const baseUrl ="/companies/parking/v1/companies/all";
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
        throw new Error("Error fetching companies")
    }
}

export async function getCompaniesWithoutMainAdmin(headers) {
    try {
        const response = await api.get("/companies/parking/v1/companies/companies-with-no-main-admin",{ headers })
        return response.data
    } catch (error) {
        throw new Error("Error fetching companies")
    }
}


/* This function gets a company by the id */
export async function getCompanyById(companyId) {
    try {
        const result = await api.get(`/rooms/room/${companyId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error fetching company ${error.message}`)
    }
}

/* This isthe function to delete a company */
export async function deleteCompany(companyId,headers) {
    try {
        const response = await api.delete(`/companies/parking/v1/companies/delete/${companyId}`,{ headers })
        return response.data
    } catch (error) {
        return error.message
    }
}