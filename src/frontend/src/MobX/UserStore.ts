import { observable, action } from 'mobx'
import MainStore from "./MainStore"


export default class UserStore {
    private mainStore: MainStore;

    @observable userName = "";
    @observable authToken = "";

    constructor(rootStore: MainStore) {
        this.mainStore = rootStore;
    }

    @action getName = (name: string): void => {

    }
}