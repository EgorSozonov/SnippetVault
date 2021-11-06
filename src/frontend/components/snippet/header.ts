
import HoverSelect from '../../commonComponents/hoverSelect/HoverSelect'
import './snippet.css'
import { html } from 'htm/react'
import { useContext } from 'react'
import MainState from '../../mobX/MainState'
import { StoreContext } from '../../App'
import { observer } from 'mobx-react-lite'
import HoverGroupSelect from '../../commonComponents/hoverSelect/HoverGroupSelect'


const Header: React.FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)

    return (html `
        <nav>
            <div class="headerContainer">
                <div class="choiceInput headerLeftmost">
                    <div class="headerDropdownLabel"><label >Task group:</label></div>
                    <${HoverSelect} currValue=${state.app.taskGroup} choices=${state.app.taskGroups} uniqueName="TaskGroupChoice"
                        selectCallback=${state.app.setTaskGroup}><//>
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 1:</label></div>
                    <${HoverGroupSelect} currValue=${state.app.language1} choiceGroups=${state.app.languageGroups} uniqueName="Lang1"
                        selectCallback=${state.app.setLanguage1}><//>
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 2:</label></div>
                    <${HoverGroupSelect} currValue=${state.app.language2} choiceGroups=${state.app.languageGroups} uniqueName="Lang2" 
                        selectCallback=${state.app.setLanguage2}><//>                    
                </div>
                <div class="choiceInputButton">
                    ↩ Previous
                </div>
                <div class="choiceInputButton headerRightmost">
                    ↪ Next
                </div>
            </div>
        </nav>
        `
      );
})

export default Header