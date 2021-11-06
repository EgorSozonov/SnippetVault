import { FunctionComponent, useContext } from 'react'
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


const ListTaskGroups = (props: any) => EditableList<TaskGroupDTO>(props)
const ListLanguages = (props: any) => EditableList<LanguageGroupDTO>(props)

const Admin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    
    return html`
        <div class="adminContainer">
            <p>
                <${NavLink} to=${PATHS["snippet"].url}>
                    <div class="adminHeader">Back to snippets</div>
                <//>
            </p>
            <${ListTaskGroups} values=${state.app.taskGroups} title="Task groups"></EditableList>
            <${ListLanguages} values=${state.app.languageGroups} title="Languages"></EditableList>
            <div>
                <${NewProposal} />
            </div>
        </div>
    `
})

export default Admin