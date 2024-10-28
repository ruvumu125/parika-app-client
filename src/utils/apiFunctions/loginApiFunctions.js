import {api} from "./baseUrl";

/* This function adds a new vehicule type to the database */
export async function loginUser(login) {
    try {
        const response = await api.post("/authentication/parking/v1/auth/authenticate", login)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}