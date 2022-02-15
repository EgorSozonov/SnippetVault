import HttpClient from "../../ports/http/HttpClient";
import IClient from "../../ports/IClient";
import AdminState from "./AdminState";
import AppState from "./AppState";
import UserState from "./UserState";


export default class MainState {
    app: AppState
    user: UserState
    admin: AdminState
    client: IClient = new HttpClient()

    constructor() {
        this.app = new AppState(this.client)
        this.user = new UserState(this.client)
        this.admin = new AdminState(this.client)
    }
}
