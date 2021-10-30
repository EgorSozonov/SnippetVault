import { useState } from "react"
import IHasName from "../../interfaces/IHasName"
import IStringKeyed from "../../interfaces/IStringKeyed"
import "./editableList.css"
import { html } from 'htm/react'


type Props<T extends IStringKeyed & IHasName> = {
    values: T[],
    title: string,
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
                                    ${Object.keys(v).map((k: string, idxKey: number) => {
                                        return html`
                                            <li key=${idxKey} class="editableListEdit">
                                                <span><label>${k}</label></span>
                                                <span><input type="text" defaultValue=${v[k]} onFocus=${(event:any) => event.target.select()} />
                                                </span>
                                                <span><button>Save</button></span>                                            
                                            </li>`
                                    })}
                                </ul>
                            `}
                        </li>
                    `}
                )}
            </ul>
        </div>
    `
}


export default EditableList