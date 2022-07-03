import SelectChoice from "../../../types/SelectChoice"

type SnippetState =
    | { type: "ChoicesLoaded", id: number, code: string, name: string, choices: SelectChoice[], }
    | { type: "ChoicesAbsent", code: string, }

export default SnippetState

// ChoicesLoaded -> ChoicesLoaded
export function updateCode(oldState: SnippetState, newCode: string): SnippetState {
    if (oldState.type !== "ChoicesLoaded") return oldState
    const tryFindNewValue = oldState.choices.find(x => x.code === newCode)
    if (!tryFindNewValue) return oldState

    return {...oldState, id: tryFindNewValue.id, code: newCode, name: tryFindNewValue.name, }
}

// ChoicesLoaded -> ChoicesLoaded
export function updateId(oldState: SnippetState, allChoices: SelectChoice[], newId: number): SnippetState {
    if (oldState.type !== "ChoicesLoaded" || oldState.id === newId) return oldState

    const tryFindNewValue = oldState.choices.find(x => x.id === newId)
    if (!tryFindNewValue || !tryFindNewValue.code) return oldState
    const filteredChoices = allChoices.filter(x => x.id !== newId)
    return {...oldState, id: newId, code: tryFindNewValue.code, name: tryFindNewValue.name, choices: filteredChoices, }
}

// ChoicesLoaded -> ChoicesLoaded
export function updateLanguageId(oldState: SnippetState, otherState: SnippetState, allChoices: SelectChoice[], newId: number): SnippetState {
    if (oldState.type !== "ChoicesLoaded" || oldState.id === newId) return oldState

    const tryFindNewValue = oldState.choices.find(x => x.id === newId)
    if (!tryFindNewValue || !tryFindNewValue.code) return oldState

    let filteredChoices = allChoices.filter(x => x.id !== newId)
    if (otherState.type === "ChoicesLoaded") {
        filteredChoices = filteredChoices.filter(x => x.id !== otherState.id)
    }
    return {...oldState, id: newId, code: tryFindNewValue.code, name: tryFindNewValue.name, choices: filteredChoices, }
}

// ChoicesLoaded -> ChoicesLoaded
export function updateUrl(oldState: SnippetState, newCode: string): SnippetState {
    return (oldState.type === "ChoicesLoaded")
                ? updateCode(oldState, newCode)
                : updateWithoutChoices(oldState, newCode)
}

// ChoicesAbsent -> ChoicesAbsent
export function updateWithoutChoices(oldState: SnippetState, newCode: string) : SnippetState {
    if (oldState.type !== "ChoicesAbsent") return oldState

    return {...oldState, type: "ChoicesAbsent", code: newCode, }
}

// ChoicesAbsent -> ChoicesLoaded
export function updateWithChoicesUrl(oldState: SnippetState, newChoices: SelectChoice[]) : SnippetState {
    if (oldState.type !== "ChoicesAbsent" || !newChoices || newChoices.length < 1) return oldState

    const tryFindNewValue = newChoices.find(x => x.code === oldState.code)

    if (tryFindNewValue && tryFindNewValue.code) {
        const filteredChoices = newChoices.filter(x => x.id !== tryFindNewValue.id)
        return { type: "ChoicesLoaded", id: tryFindNewValue.id,  code: oldState.code, name: tryFindNewValue.name, choices: filteredChoices, }
    } else {
        const startChoice = newChoices[0]
        const filteredChoices = newChoices.slice(1)
        return { type: "ChoicesLoaded", id: startChoice.id,  code: startChoice.code ?? "", name: startChoice.name, choices: filteredChoices, }
    }
}

// ChoicesAbsent -> ChoicesLoaded
export function updateLanguagesWithChoices(oldState: SnippetState, startChoice: SelectChoice, newChoices: SelectChoice[]) : SnippetState {
    if (oldState.type !== "ChoicesAbsent" || !newChoices || newChoices.length < 1) return oldState

    const tryFindNewValue = newChoices.find(x => x.code === oldState.code)

    if (tryFindNewValue && tryFindNewValue.code) {
        return { type: "ChoicesLoaded", id: tryFindNewValue.id,  code: oldState.code, name: tryFindNewValue.name, choices: newChoices, }
    } else {
        return { type: "ChoicesLoaded", id: startChoice.id,  code: startChoice.code ?? "", name: startChoice.name, choices: newChoices, }
    }
}

export function updateLanguageChoices(oldState: SnippetState, newChoices: SelectChoice[]): SnippetState {
    if (oldState.type === "ChoicesAbsent" || !newChoices || newChoices.length < 1) return oldState
    const newValue = (newChoices && newChoices.length > 0) ? newChoices : []
    return { ...oldState, choices: newValue, }
}

export function isStateOK(st: SnippetState[]): boolean {
    const f = !st.some(x => x.code === "" || x.code === "undefined")
    return f
}

export function stringOf(st: SnippetState): string {
    if (st.type === "ChoicesLoaded") return st.name
    else return st.code
}

export function idOf(st: SnippetState): number {
    if (st.type === "ChoicesLoaded") return st.id
    else return -1
}
