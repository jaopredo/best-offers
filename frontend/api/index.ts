import axios from "axios"

const AxiosService = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
})

export default AxiosService
