import Cookies from "js-cookie";

export const useGetHeader = () => {

    const token = Cookies.get("jwtToken");

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};