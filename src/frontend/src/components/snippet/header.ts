
import HoverSelect from '../../commonComponents/hoverSelect/hoverSelect'
import './snippet.css'
import { html } from 'htm/react'
import { useContext } from 'react'
import MainState from '../../MobX/MainState'
import { StoreContext } from '../../app'
import { observer } from 'mobx-react-lite'


const Header: React.FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)

    return (html `
        <nav>
            <div class="headerContainer">
                <div class="choiceInput headerLeftmost">
                    <div class="headerDropdownLabel"><label >Task group:</label></div>
                    <${HoverSelect} choices=${["strings", "file system", "spreadsheets"]} uniqueName="TaskGroupChoice"
                        selectCallback=${state.app.setTaskGroup}><//>
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 1:</label></div>
                    <${HoverSelect} choices=${["C#", "Swift", "Typescript"]} uniqueName="Lang1"
                        selectCallback=${state.app.setLanguage1}><//>
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 2:</label></div>
                    <${HoverSelect} choices=${["C#", "Typescript"]} uniqueName="Lang2" 
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