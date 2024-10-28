import {api} from "./baseUrl";

/* This function adds a new main administrator to the database */
export async function addAgent(newAgentData,headers) {
    const formData = new FormData()
    for (let key in newAgentData) {
        if (typeof newAgentData[key] === 'object' && newAgentData[key] !== null) {
            for (let innerKey in newAgentData[key]) {
                formData.append(`${key}.${innerKey}`, newAgentData[key][innerKey]);
            }
        } else {
            formData.append(key, newAgentData[key]);
        }
    }


    const response = await api.post("/agents/parking/v1/agents/create",formData,{ headers })
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

/* This function gets all companies from the database */
export async function getAgents(companyId,search,page,headers) {

    const baseUrl ="/agents/parking/v1/agents/company/";
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
        throw new Error("Error fetching agent")
    }
}

export async function getCompanyAgent(companyId,headers) {
    try {
        const response = await api.get(`/agents/parking/v1/agents/company-with-no-search-and-pagination/${companyId}`,{ headers })
        return response.data
    } catch (error) {
        throw new Error(`Error fetching parking space ${error.message}`)
    }
}