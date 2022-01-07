import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_PREFIX1, BASE_URL } from '../../core/params/Url'


const API_PREFIX = API_PREFIX1

const axiosConfig: AxiosRequestConfig = {
    baseURL: BASE_URL + API_PREFIX,
    timeout: 10000,
    //transformResponse: [],
    //headers: {'X-Custom-Header': 'foobar'},
}

const createClient = (): AxiosInstance => axios.create(axiosConfig)
export default createClient