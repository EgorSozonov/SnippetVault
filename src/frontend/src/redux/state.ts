import { createStore } from "redux";
import reducer from "./reducer";


export type SVState = {
    openSelect: string,
    language1: string,
    language2: string,
    taskGroup: string,
}

export const INIT_STATE: SVState = {
    openSelect: "",
    language1: "",
    language2: "",
    taskGroup: "",
}

const globalState = createStore<SVState, any, any, any>(reducer)

export default globalState;