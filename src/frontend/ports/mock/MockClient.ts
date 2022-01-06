
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import {mockData, getMockTasks, getMockAlternatives, getMockSnippets, getMockSnippetsByCode} from "./MockData"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../../core/types/dto/AuthDTO"
import { LanguageGroupedDTO, LanguageDTO, TaskGroupDTO, LanguageGroupDTO, TaskDTO } from "../../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO } from "../../core/types/dto/SnippetDTO"
import { StatsDTO } from "../../core/types/dto/UserDTO"


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

    getAlternatives(tlId: number): Promise<EitherMsg<AlternativesDTO[]>> {
        return this.wrapOK(getMockAlternatives(tlId))
    }

    getAdminStats(): Promise<EitherMsg<StatsDTO[]>> {
        return this.wrapOK([])
    }

    proposalCreate(prop: string, languageId: number, taskId: number, headers: SignInSuccessDTO): Promise<string> {
        return this.wrapOKString("OK")
    }

    proposalApprove(snId: number): Promise<string> {
        return this.wrapOKString("OK")
    }

    proposalDecline(snId: number): Promise<string> {
        return this.wrapOKString("OK")
    }

    snippetMarkPrimary(snId: number): Promise<string> {
        return this.wrapOKString("OK")
    }

    userRegister(dto: SignInDTO) {
        return this.wrapOK([{userId: 0, accessToken: "", }])
    }
    
    userSignIn(dto: SignInDTO) {
        return this.wrapOK([{userId: 0, accessToken: "", }])
    }

    adminSignIn(dto: SignInAdminDTO) {
        return this.wrapOK([{userId: 0, accessToken: "", }])
    }

    userProfile() {
        return this.wrapOK([mockData.userProfile])
    }
    
    private wrapOK<T>(val: T): Promise<EitherMsg<T>> {
        return new Promise((resolve) => resolve({isOK: true, value: val}))
    }

    private wrapOKString(val: string): Promise<string> {
        return new Promise((resolve) => resolve(val))
    }
}

export default MockClient