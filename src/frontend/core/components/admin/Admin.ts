import { FunctionComponent, useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import EditableList from "../../commonComponents/editableList/EditableList"
import PATHS from "../../params/Path"
import TaskGroupDTO from "../../types/dto/TaskGroupDTO"
import NewProposal from "./NewProposal"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "../../App"
import MainState from "../../mobX/MainState"
import LanguageGroupDTO from "../../types/dto/LanguageGroupDTO"
import { Editability } from "../../types/Editability"
import { fetchFromClient } from "../../utils/Client"
import LanguageDTO from "../../types/dto/LanguageDTO"
import IClient from "../../../ports/IClient"
import AdminLogin from "./AdminLogin"


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
        fetchFromClient(state.app.client.getTaskGroups(), state.app.setTaskGroups)
        fetchFromClient(state.app.client.getLanguageGroups(), state.app.setLanguageGroups)
    }, [])

    console.log(state.user.userStatus)
    return html`
        <div class="adminContainer">
            ${state.user.userStatus !== "admin"            
            ? html`
                    <${AdminLogin} />
                `
            : html`
                    <div>
                        <${NavLink} to=${PATHS["snippet"].url}>
                            <div class="adminHeader">Back to snippets</div>
                        <//>
                    </div>
                    <${ListTaskGroups} values=${state.app.taskGroups} editabilities=${editabilityTaskGroup} title="Task groups"></EditableList>
                    <${ListLanguageGroups} values=${state.app.languageGroups} editabilities=${editabilitiesLanguageGroup} title="Language Groups"></EditableList>
                    <${ListLanguages} values=${state.app.languages} editabilities=${editabilityLanguage} title="Languages"></EditableList>
                    <div>
                        <${NewProposal} />
                    </div>
                `
            }
            
        </div>
    `
})

export default Admin