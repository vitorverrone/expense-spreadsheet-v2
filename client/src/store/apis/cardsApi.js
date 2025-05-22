import axios from "axios";

const baseUrl = import.meta.env.MODE === 'production' ? import.meta.VITE_PROD_URL : `${location.protocol}//${location.hostname}:3005/api/v1`;

console.log('baseUrl', baseUrl);

const api = axios.create({ baseURL: baseUrl, /* headers : {'Authorization' : `Bearer ${apiToken}`} */ });

export const addCard = async (card) => {
    await api.post("/cards", card).then(res => res.data);
}

export const fetchCards = async (userId) => {
    return await api.get(`/cards/${userId}`).then((res) => res.data)
}

export const deleteCard = async (id) => {
    return await api.delete(`/cards/${id}`).then((res) => res.data)
}
