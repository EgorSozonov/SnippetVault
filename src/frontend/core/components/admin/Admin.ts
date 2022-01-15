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
import { fetchFromClient } from "../../utils/Client"
import IClient from "../../../ports/IClient"
import AdminLogin from "./AdminLogin"
import { LanguageGroupDTO, LanguageDTO, TaskGroupDTO } from "../dto/AuxDTO"
import { empty } from "../../utils/ComponentUtils"


const ListTaskGroups = (props: any) => EditableList<TaskGroupDTO>(props)
const ListLanguageGroups = (props: any) => EditableList<LanguageGroupDTO>(props)
const ListLanguages = (props: any) => EditableList<LanguageDTO>(props)

const editabilityTaskGroup: Editability<TaskGroupDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    }
]

const Admin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    const editabilitiesLanguageGroup: Editability<LanguageGroupDTO>[] = [
        {
            field: "name",
            fieldType: "string",
        },
        {
            field: "order",
            fieldType: "int",
        },
    ]
    const editabilityLanguage: Editability<LanguageDTO>[] = [
        {
            field: "name",
            fieldType: "string",
        },
        {
            field: "lgName",
            fieldType: "choice",
            choices: state.app.languageGroups.map(x => {return {id: x.id, name: x.name}}),
        },
    ]

    const client: IClient = state.app.client
    useEffect(() => {
        fetchFromClient(client.languagesReqGet(), state.app.languagesSet)
        fetchFromClient(client.taskGroupsGet(), state.app.taskGroupsSet)
        fetchFromClient(client.languageGroupsGet(), state.app.languageGroupsSet)
        fetchFromClient(client.adminStatsGet(), state.app.statsSet)
        state.user.trySignInFromLS()
    }, [])

    const [changeAdminPwMode, setChangeAdminPwMode] = useState(false)

    const oldPw1Ref = useRef<HTMLInputElement>(null)
    const oldPw2Ref = useRef<HTMLInputElement>(null)
    const newPw1Ref = useRef<HTMLInputElement>(null)
    const newPw2Ref = useRef<HTMLInputElement>(null)

    const changeAdminPwHandler = () => {
        setChangeAdminPwMode(true)
    }

    const closeChangeAdminPwHandler = () => {
        setChangeAdminPwMode(false)
    }

    const saveChangeAdminPwHandler = () => {
        setChangeAdminPwMode(false)
    }

    const changePwMenu = html`
        <div class="adminChangePw">
            <div>Old password 1:</div>
            <div><input type="password" ref=${oldPw1Ref} /></div>
            <div>Old password 2:</div>
            <div><input type="password" ref=${oldPw2Ref} /></div>
            <div>New password 1:</div>
            <div><input type="password" ref=${newPw1Ref} /></div>
            <div>New password 2:</div>
            <div><input type="password" ref=${newPw2Ref} /></div>
            <div class="profileButtons">
                <div class="clickable" onClick=${closeChangeAdminPwHandler}>Cancel</div>
                <div class="clickable" onClick=${saveChangeAdminPwHandler}>Save</div>
            </div>
        </div>
    ` 

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
                        <${ListTaskGroups} values=${state.app.taskGroups} editabilities=${editabilityTaskGroup} title="Task groups"></EditableList>
                        <${ListLanguageGroups} values=${state.app.languageGroups} editabilities=${editabilitiesLanguageGroup} title="Language Groups"></EditableList>
                        <${ListLanguages} values=${state.app.languages} editabilities=${editabilityLanguage} title="Languages"></EditableList>
                        <${NewProposal} />                 
                        ` 
                    : changePwMenu
                    )
            }      
        </div>
    `
})

export default Admin