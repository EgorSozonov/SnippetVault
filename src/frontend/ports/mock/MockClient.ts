import AlternativeDTO from "../../core/types/dto/AlternativeDTO"
import LanguageGroupedDTO from "../../core/types/dto/LanguageGroupedDTO"
import LanguageGroupDTO from "../../core/types/dto/LanguageGroupDTO"
import LanguageDTO from "../../core/types/dto/LanguageDTO"
import ProposalDTO from "../../core/types/dto/ProposalDTO"
import SnippetDTO from "../../core/types/dto/SnippetDTO"
import TaskDTO from "../../core/types/dto/TaskDTO"
import TaskGroupDTO from "../../core/types/dto/TaskGroupDTO"
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import {mockData, getMockTasks, getMockAlternatives, getMockSnippets, getMockSnippetsByCode} from "./MockData"


class MockClient implements IClient {
    getSnippets(taskGroup: number, lang1: number, lang2: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.wrapOK(getMockSnippets(taskGroup, lang1, lang2))
    }

    getSnippetsByCode(taskGroup: string, lang1: string, lang2: string): Promise<EitherMsg<SnippetDTO[]>> {
        return this.wrapOK(getMockSnippetsByCode(taskGroup, lang1, lang2))
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

    getAlternatives(tlId: number): Promise<EitherMsg<AlternativeDTO[]>> {
        return this.wrapOK(getMockAlternatives(tlId))
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