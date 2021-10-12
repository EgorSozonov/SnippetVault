import { observable, action } from 'mobx'
import MainStore from "./MainStore"


export default class AppStore {
    private mainStore: MainStore;

    @observable language1 = "";
    @observable language2 = "";
    @observable taskGroup = "";
    @observable openSelect = "";

    constructor(rootStore: MainStore) {
        this.mainStore = rootStore;
    }

    @action getName = (name: string): void => {

    }
}