import axios from "axios";

let baseUrl = `${location.protocol}//${location.hostname}:3005/api/v1`;

if (location.hostname !== 'localhost') {
    baseUrl = `https://expense-spreadsheet-v2.onrender.com:3005/api/v1`;
}

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
