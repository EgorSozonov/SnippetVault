import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_PREFIX, BASE_URL } from './params/Url'


const axiosConfig: AxiosRequestConfig = {
    baseURL: BASE_URL + API_PREFIX,
    timeout: 10000,
    //headers: {'X-Custom-Header': 'foobar'},
}

const createClient = (): AxiosInstance => axios.create(axiosConfig)
export default createClient