import "./Alternative.css"
import React from "react"
import { FunctionComponent, useContext, useRef, useState } from "react"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"
import { LanguageDTO, TaskDTO } from "../../types/dto/AuxDTO"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
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
    const state = useContext<MainState>(storeContext)
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

    const taskOrId:{type: "task", payload: TaskDTO, } | {type: "taskId", payload: number, } = {type: "task", payload: task, }

    return (
        <div className="alternativeHeader">
            <div className="alternativeHeaderMain">
                <div className="alternativeHeaderMainLeft">
                    <div className="alternativeHeaderGridLeft"> Language:
                    </div>
                    <div className="alternativeHeaderGridRight"> {lang !== null && lang.name}
                    </div>
                    <div className="alternativeHeaderGridLeft">
                        Task:
                    </div>
                    <div className="alternativeHeaderGridRight">
                        {task.taskGroupName} / {task.name}
                    </div>
                    <div className="alternativeHeaderGridLeft">
                        Description:
                    </div>
                    <div className="alternativeHeaderGridRight">
                        {task.description}
                    </div>
                </div>
                <div className="alternativeHeaderMainRight">
                    <div className="alternativeHeaderMainRightCode">
                        {primaryAlternative !== null && primaryAlternative.content}
                    </div>
                </div>
            </div>
            <div className="alternativeHeaderMainFooter">
                <span>Upload date: {primaryAlternative !== null && fmtDt(primaryAlternative.tsUpload)}</span>
                <span>Score: {primaryAlternative !== null && primaryAlternative.score}</span>
                {primaryAlternative.voteFlag
                    ?
                        <span className="alternativeFooterVoted">
                            Voted!
                        </span>
                    : (isSignedIn === true &&

                           <span className="alternativeFooterVote" onClick={voteHandler(primaryAlternative.id)}>
                                <span className="alternativeItemButton">V</span>Vote
                            </span>
                        )
                }
                {(lang !== null && isSignedIn === true) && <span className="clickable alternativeOpenProposal" onClick={openProposalDialog}>
                    Propose a new snippet
                </span>
                }
                <span>
                    <Toggler leftChoice={"By date"} rightChoice={"By votes"} initChosen={false}
                                leftCallback={() => state.snip.alternativesResort("byDate")} rightCallback={() => state.snip.alternativesResort("byScore")} />
                </span>
            </div>
            { lang !== null &&
                    <Dialog state={proposalDialog} closeCallback={closeProposalDialog}>
                        <ProposalInput lang={{id: lang.id, name: lang.name, }} taskOrId={taskOrId} closeCallback={closeProposalDialog} />
                    </Dialog>

            }
        </div>
    )

})

export default AlternativePrimary
