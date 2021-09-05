import { Reducer } from "redux";
import { INIT_STATE, SVState } from "./state"


type ReduxAction = 
    | {type: "login", payload: {userName: string, pw: string}}
    | {type: "logout", payload: {}}
    | {type: "changeSelect", payload: {selectName: string}}
    | {type: "setLanguage1", payload: {newValue: string}}
    | {type: "setLanguage2", payload: {newValue: string}}
    | {type: "setTaskGroup", payload: {newValue: string}}


const reducer: Reducer<SVState, ReduxAction> = (state: SVState = INIT_STATE, action: ReduxAction): SVState => {
    switch(action.type) {
        case "login":
            return state;
        case "logout":
            return state;
        case "changeSelect": {
            return {...state, openSelect: action.payload.selectName, }
        }
        case "setLanguage1": {
            return {...state, language1: action.payload.newValue, }
        }
        case "setLanguage2": {
            return {...state, language2: action.payload.newValue, }
        }
        case "setTaskGroup": {
            return {...state, taskGroup: action.payload.newValue, }
        }
    }
    return state;
}

export default reducer