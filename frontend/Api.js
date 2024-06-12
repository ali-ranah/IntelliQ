import axios from "axios"
export const API_URL = axios.create({
    baseURL: "http://192.168.235.248:5000"
})
