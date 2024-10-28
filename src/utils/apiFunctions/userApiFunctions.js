import {api} from "./baseUrl";

/* This function gets a company by the id */
export async function enableUser(userId,isUserActive,headers) {

    const formData = new FormData()
    formData.append("id", userId)
    formData.append("isUserActive", isUserActive)

    return await api.put(`/users/parking/v1/users/enable/${userId}`, formData, { headers })

}

export async function desableUser(userId,isUserActive,headers) {

    const formData = new FormData()
    formData.append("id", userId)
    formData.append("isUserActive", isUserActive)

    return await api.put(`/users/parking/v1/users/desable/${userId}`, formData, { headers })
}