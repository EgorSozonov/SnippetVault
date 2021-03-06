import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_PREFIX1 } from '../../config/Url'
import { deserializeJSON } from '../../core/utils/Client'


const API_PREFIX = API_PREFIX1

const axiosConfig: AxiosRequestConfig = {
    baseURL: API_PREFIX,
    timeout: 10000,
    transformResponse: [deserializeJSON],
    withCredentials: true,
    //headers: {'X-Custom-Header': 'foobar'},
}

const createClient = (): AxiosInstance => axios.create(axiosConfig)
export default createClient
