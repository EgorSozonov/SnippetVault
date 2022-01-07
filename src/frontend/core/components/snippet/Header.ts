
import HoverSelect from "../../commonComponents/hoverSelect/HoverSelect"
import "./snippet.css"
import { html } from "htm/react"
import { useContext, useEffect } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { observer } from "mobx-react-lite"
import { NavLink } from "react-router-dom"
import PATHS from "../../params/Path"


const Header: React.FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    useEffect(() => {
        const fromLS = localStorage.getItem("user")        
        if (fromLS && fromLS.length > 0 && fromLS !== "undefined") {
            const userFromLS = JSON.parse(fromLS)
            if (userFromLS.userId > -1 && userFromLS.status === "user") {
                state.user.userId = userFromLS.userId
                state.user.accessToken = userFromLS.accessToken
                state.user.userStatus = "user"
            }
        }
    }, [])
    return (html `
        <nav>
            <div class="headerContainer">
                <div class="choiceInput headerLeftmost">
                    <div class="headerDropdownLabel"><label>Task group:</label></div>
                    ${state.app.tg.type === "ChoicesLoaded" && 
                        html`<${HoverSelect} currValue=${state.app.tg} choices=${state.app.tg.choices} uniqueName="TaskGroupChoice"
                        selectCallback=${state.app.taskGroupSet}><//>`
                    }                    
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label>Language 1:</label></div>
                    ${state.app.l1.type === "ChoicesLoaded" && 
                        html`<${HoverSelect} currValue=${state.app.l1} choices=${state.app.l1.choices} uniqueName="Lang1Choice"
                        selectCallback=${state.app.language1Set}><//>`
                    }
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label>Language 2:</label></div>
                    ${state.app.l2.type === "ChoicesLoaded" && 
                        html`<${HoverSelect} currValue=${state.app.l2} choices=${state.app.l2.choices} uniqueName="Lang2Choice"
                        selectCallback=${state.app.language2Set}><//>`
                    }                    
                </div>
                ${(state.user.userStatus === "user" && state.user.userName.length > 0) && 
                    html`
                        <div class="headerUsername headerRightmost choiceInput">
                            <div>${state.user.userName}</div>
                            <${NavLink} exact to=${`${PATHS["profile"].url}`}>
                                <div class="headerProfileButton">
                                    Profile
                                </div>
                            <//>                             
                        </div>
                    `
                }
            </div>
        </nav>
        `
      );
})

export default Header