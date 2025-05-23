import axios from "axios";

const baseUrl = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PROD_URL : `${location.protocol}//${location.hostname}:3005/api/v1`;

const api = axios.create({ baseURL: baseUrl, /* headers : {'Authorization' : `Bearer ${apiToken}`} */ });

export const addBill = async (bill) => {
    await api.post("/bills", bill).then(res => res.data);
}

export const fetchBills = async (userId, month, filterSearch) => {
    return await api.get(`/bills/${userId}/${month}/${filterSearch}`).then((res) => res.data)
}

export const deleteBill = async (id) => {
    return await api.delete(`/bills/${id}`).then((res) => res.data)
}
