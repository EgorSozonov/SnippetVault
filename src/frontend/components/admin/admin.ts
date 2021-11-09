import { FunctionComponent, useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import EditableList from "../../commonComponents/editableList/EditableList"
import PATHS from "../../params/Path"
import TaskGroupDTO from "../../../common/dto/TaskGroupDTO"
import NewProposal from "./NewProposal"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "../../App"
import MainState from "../../mobX/MainState"
import LanguageGroupDTO from "../../../common/dto/LanguageGroupDTO"
import { Editability } from "../../types/Editability"
import { fetchFromClient } from "../../utils/Client"
import LanguageReqDTO from "../../../common/dto/LanguageReqDTO"
import IClient from "../../interfaces/IClient"


const ListTaskGroups = (props: any) => EditableList<TaskGroupDTO>(props)
const ListLanguageGroups = (props: any) => EditableList<LanguageGroupDTO>(props)
const ListLanguages = (props: any) => EditableList<LanguageReqDTO>(props)

const editabilityTaskGroup: Editability<TaskGroupDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    }
]

const editabilityLanguage: Editability<LanguageReqDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    },
    {
        field: "languageGroup",
        fieldType: "choice",
        choices: [
            {id: 1, name: "Universal", },
            {id: 2, name: "Scripting", },
        ]
    },
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
    const client: IClient = state.app.client
    useEffect(() => {
        fetchFromClient(client.getLanguagesReq(), state.app.setLanguages)
        fetchFromClient(state.app.client.getTaskGroups(), state.app.setTaskGroups)
        fetchFromClient(state.app.client.getLanguageGroups(), state.app.setLanguageGroups)
    }, [])
    return html`
        <div class="adminContainer">
            <div>
                <${NavLink} to=${PATHS["snippet"].url}>
                    <div class="adminHeader">Back to snippets</div>
                <//>
            </div>
            <${ListTaskGroups} values=${state.app.taskGroups} editabilities=${editabilityTaskGroup} title="Task groups"></EditableList>
            <${ListLanguageGroups} values=${state.app.languageGroups} editabilities=${editabilitiesLanguageGroup} title="Languages"></EditableList>
            <${ListLanguages} values=${state.app.languages} editabilities=${editabilityLanguage} title="Languages"></EditableList>
            <div>
                <${NewProposal} />
            </div>
        </div>
    `
})

export default Admin