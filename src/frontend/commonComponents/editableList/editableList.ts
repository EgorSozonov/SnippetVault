import { useState } from "react"
import IHasName from "../../interfaces/IHasName"
import IStringKeyed from "../../interfaces/IStringKeyed"
import "./editableList.css"
import { html } from 'htm/react'


type Props<T extends IStringKeyed & IHasName> = {
    values: T[],
    title: string,
}

function inputSelectHandler(event:any) {
    event.target.select()
}

const EditableList = <T extends IStringKeyed & IHasName>({values, title, }: Props<T>) => {
    const [openIdx, setOpenIdx] = useState(-1)
    const rowClickHandler = (idx: number) => {
        if (idx === openIdx) {
            setOpenIdx(-1)
        } else {
            setOpenIdx(idx)
        }
    }

    return html`
        <div class="editableListContainer">
            <div class="editableListHeader">
                <div class="editableListTitle"><h5>${title}</h5></div>
                <div class="editableListHeaderButton">+</div>
            </div>
            
            <ul>
                ${values.map((v: T, idx: number) => {
                    return html`
                        <li key=${idx} class="editableListRow">
                            <div onClick=${() => rowClickHandler(idx)} class=${(openIdx === idx ? " editableListRowActive" : "")}>
                                <span class="editableListCell">${v.name}</span>
                            </div>
                            ${openIdx === idx && html`
                                <ul>
                                    ${Object.keys(v).filter(x => x !== "id").map((k: string, idxKey: number) => {
                                        return html`
                                            <li key=${idxKey} class="editableListEdit">
                                                <span class="editableListColumn">
                                                    <label>${k}</label>
                                                </span>
                                                <span class="editableListColumn">
                                                    <input type="text" defaultValue=${v[k]} onFocus=${inputSelectHandler} />
                                                </span>
                                            </li>`
                                    })}
                                </ul>
                                <div>
                                    <button>Save</button>
                                </div>
                            `}

                        </li>
                    `}
                )}
            </ul>
        </div>
    `
}


export default EditableList