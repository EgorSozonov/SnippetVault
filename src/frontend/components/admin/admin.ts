import { FunctionComponent, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import EditableList from '../../commonComponents/editableList/EditableList'
import PATHS from '../../params/Path'
import TaskGroupDTO from '../../../common/dto/TaskGroupDTO'
import NewProposal from './NewProposal'
import { html } from 'htm/react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../../App'
import MainState from '../../mobX/MainState'
import LanguageGroupDTO from '../../../common/dto/LanguageGroupDTO'
import { Editability } from '../../types/Editability'
import { fetchFromClient } from '../../utils/Client'


const ListTaskGroups = (props: any) => EditableList<TaskGroupDTO>(props)
const ListLanguageGroups = (props: any) => EditableList<LanguageGroupDTO>(props)

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

    useEffect(() => {
        
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
            <div>
                <${NewProposal} />
            </div>
        </div>
    `
})

export default Admin