import AppStore from "./AppStore";
import UserStore from "./UserStore";


export default class MainStore {
    appStore: AppStore;
    userStore: UserStore;

    constructor() {
        this.appStore = new AppStore(this);
        this.userStore = new UserStore(this); // Pass `this` into stores for easy communication
    }
}
