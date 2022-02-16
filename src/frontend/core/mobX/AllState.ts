import HttpClient from "../../ports/http/HttpClient";
import IClient from "../../ports/IClient";
import AdminState from "./AdminState";
import SnipState from "./SnipState";
import UserState from "./UserState";


export default class MainState {
    snip: SnipState
    user: UserState
    admin: AdminState
    client: IClient = new HttpClient()

    constructor() {
        this.snip = new SnipState(this.client)
        this.user = new UserState(this.client)
        this.admin = new AdminState(this.client)
    }
}
