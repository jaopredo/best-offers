import axios from "axios"

const AxiosService = axios.create({
    baseURL: 'http://192.168.18.191:3000/api/v1',
})

export default AxiosService
