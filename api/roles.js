import { apiGet } from "@/utilz/endpoints";

const baseUrl = import.meta.env.VITE_API_URL;

export const getRolesForEmployee = async () => {
    const res = await apiGet(`${baseUrl}/roles/get/roles`);
    return res?.data || [];
};

export const getAllRoles = async () => {
    const res = await apiGet(`${baseUrl}/roles`);
    return res?.data || [];
};