import {api} from "./baseUrl";


export async function getCompanyCollections(companyId,parkingSpaceId,agentId,startDate,endDate,page,headers) {

    const baseUrl ="/transactions/transactions/company-summary/";
    const queryParams = [];
    queryParams.push(`page=${page}`);
    queryParams.push(`size=10`);

    if (parkingSpaceId) {
        queryParams.push(`parkingSpaceId=${parkingSpaceId}`);
    }
    if (agentId) {
        queryParams.push(`agentId=${agentId}`);
    }
    if (startDate && endDate){
        queryParams.push(`startDate=${startDate}`);
        queryParams.push(`endDate=${endDate}`);
    }

    const constructedUrl = `${baseUrl}${companyId}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl,{headers})
        return response.data
    } catch (error) {
        throw new Error("Error fetching product distributions")
    }
}