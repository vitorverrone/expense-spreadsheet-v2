import axios from "axios";

const baseUrl = 'http://localhost:3005/api/v1';

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
