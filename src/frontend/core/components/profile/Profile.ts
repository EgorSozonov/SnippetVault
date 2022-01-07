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
        <div class="profileBackground">
            <div class="profileContainer">
                ${profile !== null 
                    ? html`
                        <div class="profileHeader">
                            <div>
                                <h2>${state.user.userName}</h2>
                            </div>
                            <div class="profileHeaderSubscript">
                                <h5>User Profile</h5>
                            </div>
                        </div>
                        <div>Registration date: </div>
                        <div>Total number of proposals: ${profile.proposalCount}</div>
                        <div>Approved proposals: ${profile.approvedCount}</div>
                        <div>Approved proposals selected as primary: ${profile.primaryCount}</div>
                        <div onClick=${signOutHandler} class="profileSignOut">Sign out</div>                
                    `
                    : html `
                        <${Login} />                    
                    `
                }
            </div>
        </div>
    `
})

export default Profile
