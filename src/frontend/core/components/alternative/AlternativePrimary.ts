import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useRef, useState } from "react"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"
import { LanguageDTO, TaskDTO } from "../../types/dto/AuxDTO"
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import { VoteDTO } from "../../types/dto/UserDTO"
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
    const isSignedIn = state.user.isUser.get()
    const voteHandler = (snId: number) => () => {
        const headers = state.user.headersGet()
        if (headers === null) return

        const voteDTO: VoteDTO = {snId, tlId}
        state.snip.userVote(voteDTO, headers)

    }
    const [proposalDialog, setProposalDialog] = useState<DialogState>({ isOpen: false, id: -1, title: "Post a proposal", })
    const openProposalDialog = () => setProposalDialog({ ...proposalDialog, isOpen: true })
    const closeProposalDialog = () => setProposalDialog({ ...proposalDialog, isOpen: false, })

    const taskOrId = {type: "task", payload: task, }

    return html`
        <div class="alternativeHeader">
            <div class="alternativeHeaderMain">
                <div class="alternativeHeaderMainLeft">
                    <div class="alternativeHeaderGridLeft"> Language:
                    </div>
                    <div class="alternativeHeaderGridRight"> ${lang !== null && lang.name}
                    </div>
                    <div class="alternativeHeaderGridLeft">
                        Task:
                    </div>
                    <div class="alternativeHeaderGridRight">
                        ${task.taskGroupName} / ${task.name}
                    </div>
                    <div class="alternativeHeaderGridLeft">
                        Description:
                    </div>
                    <div class="alternativeHeaderGridRight">
                        ${task.description}
                    </div>
                </div>
                <div class="alternativeHeaderMainRight">
                    <div class="alternativeHeaderMainRightCode">
                        ${primaryAlternative !== null && primaryAlternative.content}
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
                <span>
                    <${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false}
                                leftCallback=${() => state.snip.alternativesResort("byDate")} rightCallback=${() => state.snip.alternativesResort("byScore")} />
                </span>
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
