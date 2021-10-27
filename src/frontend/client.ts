import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_PREFIX } from './url'


const axiosConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:47000" + API_PREFIX,
    timeout: 10000,
    //headers: {'X-Custom-Header': 'foobar'},
}

const createClient = (): AxiosInstance => axios.create(axiosConfig)
export default createClient