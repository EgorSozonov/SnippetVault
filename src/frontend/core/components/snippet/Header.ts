
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
                    ${state.app.tg.type === "ChoicesLoaded" && 
                        html`<${HoverSelect} currValue=${state.app.tg} choices=${state.app.tg.choices} uniqueName="TaskGroupChoice"
                        selectCallback=${state.app.setTaskGroup}><//>`
                    }                    
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 1:</label></div>
                    ${state.app.l1.type === "ChoicesLoaded" && 
                        html`<${HoverSelect} currValue=${state.app.l1} choices=${state.app.l1.choices} uniqueName="Lang1Choice"
                        selectCallback=${state.app.setLanguage1}><//>`
                    }
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 2:</label></div>
                    ${state.app.l2.type === "ChoicesLoaded" && 
                        html`<${HoverSelect} currValue=${state.app.l2} choices=${state.app.l2.choices} uniqueName="Lang2Choice"
                        selectCallback=${state.app.setLanguage2}><//>`
                    }                    
                </div>
            </div>
        </nav>
        `
      );
})

export default Header