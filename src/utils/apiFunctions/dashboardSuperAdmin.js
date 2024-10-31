import {api} from "./baseUrl";


export async function getDashboardCount(headers) {
    try {
        const response = await api.get("/superadmindashboard/parking/v1/superadmindashboard",{ headers })
        return response.data
    } catch (error) {
        throw new Error("Error fetching room types")
    }
}