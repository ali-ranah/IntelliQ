import axios from "axios"
export const API_URL = axios.create({
    baseURL: "http://192.168.1.35:5000"
})
