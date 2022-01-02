import SelectChoice from "./SelectChoice"

type SnippetState = 
    | { type: "Synchronized", id: number, code: string, name: string, choices: SelectChoice[], }
    | { type: "UrlChangedNoChoices", code: string, }


type SnippetStateType = | "Synchronized" | "UrlChangedNoChoices"

export default SnippetState

// Synchronized -> Synchronized
export function updateCode(oldState: SnippetState, newCode: string): SnippetState {
    if (oldState.type !== "Synchronized") return oldState
    const tryFindNewValue = oldState.choices.find(x => x.code === newCode)
    if (!tryFindNewValue) return oldState

    return {...oldState, id: tryFindNewValue.id, code: newCode, name: tryFindNewValue.name, }
}

// Synchronized -> Synchronized
export function updateId(oldState: SnippetState, newId: number): SnippetState {
    if (oldState.type !== "Synchronized") return oldState
    const tryFindNewValue = oldState.choices.find(x => x.id === newId)
    if (!tryFindNewValue || !tryFindNewValue.code) return oldState

    return {...oldState, id: newId, code: tryFindNewValue.code, name: tryFindNewValue.name, }
}

// Synchronized -> UrlChangedNoChoices
export function updateUrl(oldState: SnippetState, newCode: string) : SnippetState {
    if (oldState.type !== "Synchronized") return oldState
    const tryFindNewValue = oldState.choices.find(x => x.code === newCode)
    if (!tryFindNewValue) return oldState

    return {...oldState, type: "UrlChangedNoChoices", code: newCode, }
}

// UrlChangedNoChoices -> Synchronized
export function updateWithChoicesUrl(oldState: SnippetState, newChoices: SelectChoice[]) : SnippetState {
    if (oldState.type !== "UrlChangedNoChoices") return oldState
    const tryFindNewValue = newChoices.find(x => x.code === oldState.code)
    if (!tryFindNewValue || !tryFindNewValue.code) return oldState

    return {...oldState, type: "Synchronized", id: tryFindNewValue.id, name: tryFindNewValue.name, choices: newChoices, }
}

export function isStateOK(st: SnippetState[]): boolean {
    return !st.some(x => x.code === ""|| x.code === "undefined")
}