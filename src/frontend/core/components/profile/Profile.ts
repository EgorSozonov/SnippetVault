 // <div><button onClick=${signOutHandler}>Sign out</button></div>

import "./snippet.css"
import { html } from "htm/react"
import { useContext, useEffect } from "react"
import IClient from "../../../ports/IClient"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { fetchFromClient } from "../../utils/Client"


type Props = {
    content: string,
    isRight: boolean,
    langId: number,
    taskId: number,
    tlId: number,
}

function Profile({content, isRight, langId, tlId, } : Props) {
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    const userId = state.user.userId
    
    const signOutHandler = () => {
        state.user.signOut()
    }

    useEffect(() => {
        if (userId > -1) {
            fetchFromClient(client.userProfile(userId), state.user.setProfile)
        }
    }, [userId])
    return html`
        ${isRight === true
            ? html`
                <div class="snippetCodeContainer">
                    <div class="snippetButtons">                        
                        ${alternativesLink}
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                    ${snippetContent}
                </div>
            `
            : html`<div class="snippetCodeContainer">
                    ${snippetContent}
                    <div class="snippetButtons snippetButtonsRight">
                        ${alternativesLink}
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                </div>
            `
        }
    `
}

export default Profile 