import { Axios, AxiosInstance } from "axios"
import LanguageDTO from "../../common/dto/LanguageDTO";
import SnippetDTO from "../../common/dto/SnippetDTO";
import TaskGroupDTO from "../../common/dto/TaskGroupDTO";
import { ENDPOINTS } from "../../common/web/Url";
import createClient from "../Client"
import IClient from "../interfaces/IClient"
import EitherMsg from "../types/EitherMsg";

class HttpClient implements IClient {
    constructor(private client: AxiosInstance) {
        client = createClient();
    }

    getSnippets(lang1: number, lang2: number, taskGroup: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.makeGetRequest<SnippetDTO[]>(`get/${ENDPOINTS.get.snippet}/${lang1}/${lang2}/${taskGroup}`)
    }

    getLanguages(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.makeGetRequest<LanguageDTO[]>(`get/${ENDPOINTS.get.language}`)
    }

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.makeGetRequest<TaskGroupDTO[]>(`get/${ENDPOINTS.get.taskGroup}`)
    }
    

    private async makeGetRequest<T>(url: string): Promise<EitherMsg<T>> {
        try {
            const r = await this.client.get<T>(url)        
            if (r.data) {
                return {isOK: true, value: r.data}
            } else {
                return {isOK: false, errMsg: "Error: empty result"}
            }
        } catch(e: any) {
            return {isOK: false, errMsg: e.toString()}
        }
    }
}
export default HttpClient