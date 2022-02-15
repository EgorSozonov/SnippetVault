import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import EditableList from "../../commonComponents/editableList/EditableList"
import PATHS from "../../params/Path"
import NewProposal from "./NewProposal"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "../../App"
import MainState from "../../mobX/MainState"
import { Editability } from "../../commonComponents/editableList/utils/Editability"
import IClient from "../../../ports/IClient"
import AdminLogin from "./AdminLogin"
import { LanguageDTO, TaskGroupDTO } from "../../types/dto/AuxDTO"
import AdminChangePw from "./AdminChangePw"


const ListTaskGroups = (props: any) => EditableList<TaskGroupDTO>(props)
const ListLanguages = (props: any) => EditableList<LanguageDTO>(props)

const editabilityTaskGroup: Editability<TaskGroupDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    }
]
const editabilityLanguage: Editability<LanguageDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    },
    {
        field: "code",
        fieldType: "string",
    },
    {
        field: "sortingOrder",
        fieldType: "int",
    },
]

const Admin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)


    const cuLanguageCallback = async (newValue: LanguageDTO) => {
        const response = await state.app.languageCU(newValue)
        if (response.isOK) {
            state.app.languagesGet()
        }
    }

    const cuTaskGroupCallback = async (newValue: TaskGroupDTO) => {
        const response = await state.app.taskGroupCU(newValue)
        if (response.isOK) {
            state.app.taskGroupsGet()
        }
    }

    useEffect(() => {
        state.app.languagesGet()
        state.app.taskGroupsGet()
        state.app.adminStatsGet()
        state.user.trySignInFromLS()
    }, [state.user.acc])

    const [changeAdminPwMode, setChangeAdminPwMode] = useState(false)
    const changeAdminPwHandler = () => {
        setChangeAdminPwMode(true)
    }

    const closeChangeAdminPwHandler = () => {
        setChangeAdminPwMode(false)
    }



    return html`
        <div class="adminContainer">
            ${state.user.isAdmin() === false
                ? html`
                        <${AdminLogin} />
                    `
                : (changeAdminPwMode === false
                    ? html`
                        <div class="adminHeaderPanel">
                            <div>
                                ${state.app.stats !== null &&
                                    html`
                                        <div>Total proposals: ${state.app.stats.proposalCount}</div>
                                        <div>Of those proposals, approved primary snippets: ${state.app.stats.primaryCount}</div>
                                        <div>Approved alternatives: ${state.app.stats.alternativeCount}</div>
                                        <div>Active users count: ${state.app.stats.userCount}</div>
                                    `}
                            </div>
                            <div>
                                <${NavLink} to=${PATHS["snippet"].url}>
                                    <div class="adminHeaderButton">Back to snippets</div>
                                <//>
                            </div>
                            <div class="adminHeaderButton" onClick=${state.user.signOut}>(sign out)</div>
                            <div class="adminHeaderButton" onClick=${changeAdminPwHandler}>Change password</div>
                        </div>
                        <${NewProposal} />
                        <${ListTaskGroups} values=${state.app.taskGroups} editabilities=${editabilityTaskGroup} title="Task groups"
                            cuCallback=${cuTaskGroupCallback} />
                        <${ListLanguages} values=${state.app.languages} editabilities=${editabilityLanguage} title="Languages"
                            cuCallback=${cuLanguageCallback} />
                        `
                    : html`<${AdminChangePw} closeChangeAdminPwHandler=${closeChangeAdminPwHandler} />`
                    )
            }
        </div>
    `
})

export default Admin
