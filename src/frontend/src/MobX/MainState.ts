import AppState from "./AppState";
import UserState from "./UserState";


export default class MainState {
    app: AppState
    user: UserState

    constructor() {
        this.app = new AppState(this)
        this.user = new UserState(this)
    }
}
