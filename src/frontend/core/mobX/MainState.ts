import HttpClient from "../../ports/http/HttpClient";
import IClient from "../../ports/IClient";
import AppState from "./AppState";
import UserState from "./UserState";


export default class MainState {
    app: AppState
    user: UserState
    client: IClient = new HttpClient()

    constructor() {
        this.app = new AppState(this.client)
        this.user = new UserState(this.client)
    }
}
