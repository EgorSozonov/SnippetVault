import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useRef, useState } from "react"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils"
import { AlternativeDTO } from "../dto/SnippetDTO"
import { LanguageDTO, TaskDTO } from "../dto/AuxDTO"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { VoteDTO } from "../dto/UserDTO"
import { fetchFromClient } from "../../utils/Client"
import Dialog from "../../commonComponents/dialog/Dialog"
import DialogState from "../../commonComponents/dialog/DialogState"
import ProposalInput from "../proposalInput/ProposalInput"


type Props = {
    primaryAlternative: AlternativeDTO,    
    lang: LanguageDTO | null,
    task: TaskDTO,
    tlId: number,
}

const AlternativePrimary: FunctionComponent<Props> = observer(({ primaryAlternative, lang, task, tlId, }) => {
    const state = useContext<MainState>(StoreContext)
    const isSignedIn = state.user.isUser()
    const voteHandler = (snId: number) => () => {
        const headers = state.user.headersGet()        
        if (headers === null) return

        const voteDTO: VoteDTO = {snId, tlId}
        state.app.client.userVote(voteDTO, headers)
            .then((r) => {
                if (r && r.status === "OK") {
                    fetchFromClient(state.app.client.alternativesForUserGet(tlId, headers.userId), state.app.alternativesSet)
                }
            })
    }
    const [proposalDialog, setProposalDialog] = useState<DialogState>({ isOpen: false, id: -1, title: "Post a proposal", })
    const openProposalDialog = () => setProposalDialog({ ...proposalDialog, isOpen: true })
    const closeProposalDialog = () => setProposalDialog({ ...proposalDialog, isOpen: false, })

    const taskOrId = {type: "task", payload: task, }    
    
    return html`                 
        <div class="alternativeHeader">
            <div class="alternativeHeaderTitle">Alternatives</div>
            <div class="alternativeHeaderMain">

                <div class="alternativeHeaderMainMid">
                    <div> Language: 
                        ${lang !== null && lang.name}
                    </div>
                    <div>
                        Task: ${task.taskGroupName} / ${task.name}
                    </div>
                    <div>
                        Description: ${task.description}
                    </div>
                </div>
                <div class="alternativeHeaderMainRight">
                    <div>
                        <${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false} 
                                    leftCallback=${() => state.app.alternativesResort("byDate")} rightCallback=${() => state.app.alternativesResort("byScore")} />
                    </div>                    
                </div>
                <div class="alternativeHeaderMainLeft">
                    <div class="alternativeHeaderMainLeftCode">
                        ${primaryAlternative !== null && primaryAlternative.code}
                    </div>
                </div>          
            </div>
            <div class="alternativeHeaderMainFooter">
                <span>Upload date: ${primaryAlternative !== null && fmtDt(primaryAlternative.tsUpload)}</span>
                <span>Score: ${primaryAlternative !== null && primaryAlternative.score}</span>
                ${primaryAlternative.voteFlag 
                    ? html`
                            <span class="alternativeFooterVoted">
                                Voted!
                            </span>
                            
                        `
                    : (isSignedIn === true &&
                        html`
                           <span class="alternativeFooterVote" onClick=${voteHandler(primaryAlternative.id)}>
                                <span class="alternativeItemButton">V</span>Vote
                            </span>
                        `)
                }
                ${(lang !== null && isSignedIn === true) && html`<span class="clickable alternativeOpenProposal" onClick=${openProposalDialog}>
                    Propose a new snippet
                </span>`
                }

            </div>
            ${ lang !== null && html`
                    <${Dialog} state=${proposalDialog} closeCallback=${closeProposalDialog}>
                        <${ProposalInput} lang=${{id: lang.id, name: lang.name, }} taskOrId=${taskOrId} closeCallback=${closeProposalDialog} />
                    <//>
                `
            }
        </div>        
    `
    
})

export default AlternativePrimary