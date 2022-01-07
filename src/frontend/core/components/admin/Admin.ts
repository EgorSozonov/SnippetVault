import { FunctionComponent, useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import EditableList from "../../commonComponents/editableList/EditableList"
import PATHS from "../../params/Path"
import NewProposal from "./NewProposal"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "../../App"
import MainState from "../../mobX/MainState"
import { Editability } from "../../types/Editability"
import { fetchFromClient } from "../../utils/Client"
import IClient from "../../../ports/IClient"
import AdminLogin from "./AdminLogin"
import { LanguageGroupDTO, LanguageDTO, TaskGroupDTO } from "../../types/dto/AuxDTO"


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
        fetchFromClient(client.getLanguagesReq(), state.app.setLanguages)
        fetchFromClient(client.getTaskGroups(), state.app.setTaskGroups)
        fetchFromClient(client.getLanguageGroups(), state.app.setLanguageGroups)
        fetchFromClient(client.getAdminStats(), state.app.setStats)
        const fromLS = localStorage.getItem("user")        
        if (fromLS && fromLS.length > 0 && fromLS !== "undefined") {
            const userFromLS = JSON.parse(fromLS)
            if (userFromLS.userId > -1 && userFromLS.status === "admin") {
                state.user.userId = userFromLS.userId
                state.user.accessToken = userFromLS.accessToken
                state.user.userStatus = "admin"
            }
        }
    }, [])

    return html`
        <div class="adminContainer">
            ${state.user.userStatus !== "admin"            
            ? html`
                    <${AdminLogin} />
                `
            : html`                    
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
                    </div>
                    <${ListTaskGroups} values=${state.app.taskGroups} editabilities=${editabilityTaskGroup} title="Task groups"></EditableList>
                    <${ListLanguageGroups} values=${state.app.languageGroups} editabilities=${editabilitiesLanguageGroup} title="Language Groups"></EditableList>
                    <${ListLanguages} values=${state.app.languages} editabilities=${editabilityLanguage} title="Languages"></EditableList>                    
                    <${NewProposal} />                    
                `
            }
            
        </div>
    `
})

export default Admin