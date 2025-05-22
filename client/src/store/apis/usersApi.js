import axios from "axios";

const baseUrl = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PROD_URL : `${location.protocol}//${location.hostname}:3005/api/v1`;

const api = axios.create({ baseURL: baseUrl, /* headers : {'Authorization' : `Bearer ${apiToken}`} */ });

export const login = (user) => {
    return api.post("/users/login", user).then(res => res.data);;
}

export const addUser = async (user) => {
    await api.post("/users", user).then(res => res.data);
}

export const getUser = async (userId) => {
    return await api.get(`/users/${userId}`).then((res) => res.data)
}
