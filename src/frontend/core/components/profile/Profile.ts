import "./profile.css"
import { html } from "htm/react"
import { useContext, useEffect } from "react"
import IClient from "../../../ports/IClient"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { fetchFromClient } from "../../utils/Client"
import { SignInSuccessDTO } from "../../types/dto/AuthDTO"
import { observer } from "mobx-react-lite"
import Login from "../../commonComponents/login/Login"


const Profile: React.FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    const userId = state.user.userId
    const profile = state.user.profile
    
    const signOutHandler = () => {
        state.user.signOut()
    }

    useEffect(() => {
        if (userId > -1) {
            const headers: SignInSuccessDTO = {accessToken: state.user.accessToken, userId}
            fetchFromClient(client.userProfile(headers), state.user.setProfile)
        }
    }, [userId])

    return html`
        <div class="profileContainer">
            ${profile !== null 
                ? html`
                    <div>
                        <h3>${state.user.userName}</h3>
                    </div>
                    <div>
                        <h4>User Profile</h4>
                    </div>
                    <div>Registration date:
                    </div>
                    <div>Total number of proposals: ${profile.proposalCount}
                    </div>
                    <div>Approved proposals: ${profile.approvedCount}
                    </div>
                    <div>Approved proposals selected as primary: ${profile.primaryCount}
                    </div>
                    <div onClick=${signOutHandler} class="profileSignOut">Sign out
                    </div>                
            `
                : html `
                    <${Login} />                    
                `
            }
        </div>
    `
})

export default Profile 