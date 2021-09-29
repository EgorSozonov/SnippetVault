import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'


const axiosConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:40100/api/v1/",
    timeout: 10000,
    //headers: {'X-Custom-Header': 'foobar'},
}

const createClient = (): AxiosInstance => axios.create(axiosConfig)
export default createClient