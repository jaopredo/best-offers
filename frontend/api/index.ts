import axios from "axios"

const AxiosService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export default AxiosService
