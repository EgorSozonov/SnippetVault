import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import LanguageGroupedDTO from "../../../common/dto/LanguageGroupedDTO"
import LanguageGroupDTO from "../../../common/dto/LanguageGroupDTO"
import LanguageDTO from "../../../common/dto/LanguageDTO"
import ProposalDTO from "../../../common/dto/ProposalDTO"
import SnippetDTO from "../../../common/dto/SnippetDTO"
import TaskDTO from "../../../common/dto/TaskDTO"
import TaskGroupDTO from "../../../common/dto/TaskGroupDTO"
import IClient from "../../interfaces/IClient"
import EitherMsg from "../../types/EitherMsg"
import {mockData, getMockTasks, getMockAlternatives, getMockSnippets} from "./MockData"


class MockClient implements IClient {
    getSnippets(lang1: number, lang2: number, taskGroup: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.wrapOK(getMockSnippets(lang1, lang2, taskGroup))
    }

    getLanguages(): Promise<EitherMsg<LanguageGroupedDTO[]>> {
        return this.wrapOK(mockData.languages)
    }

    getLanguagesReq(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.wrapOK(mockData.languagesReq)
    }

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.wrapOK(mockData.taskGroups)
    }

    getLanguageGroups(): Promise<EitherMsg<LanguageGroupDTO[]>> {
        return this.wrapOK(mockData.languageGroups)
    }

    getProposals(): Promise<EitherMsg<ProposalDTO[]>> {
        return this.wrapOK(mockData.proposals)
    }

    getTasks(tgId: number): Promise<EitherMsg<TaskDTO[]>> {
        return this.wrapOK(getMockTasks(tgId))
    }

    getAlternatives(langId: number, taskId: number): Promise<EitherMsg<AlternativeDTO[]>> {
        return this.wrapOK(getMockAlternatives(langId, taskId))
    }

    getAdminCounts(): Promise<EitherMsg<string>> {
        return this.wrapOK("Counts: bla bla")
    }

    proposalCreate(prop: string, languageId: number, taskId: number): Promise<string> {
        return this.wrapOKString("OK")
    }

    proposalApprove(snId: number): Promise<string> {
        return this.wrapOKString("OK")
    }

    snippetMarkPrimary(snId: number): Promise<string> {
        return this.wrapOKString("OK")
    }
    
    private wrapOK<T>(val: T): Promise<EitherMsg<T>> {
        return new Promise((resolve) => resolve({isOK: true, value: val}))
    }

    private wrapOKString(val: string): Promise<string> {
        return new Promise((resolve) => resolve(val))
    }
}

export default MockClient