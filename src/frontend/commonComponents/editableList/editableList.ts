import { useRef, useState } from "react"
import IHasName from "../../interfaces/IHasName"
import IStringKeyed from "../../interfaces/IStringKeyed"
import "./editableList.css"
import { html } from 'htm/react'
import { Editability } from "../../types/Editability"
import HoverSelect from "../hoverSelect/HoverSelect"
import SelectChoice from "../../../common/types/SelectChoice"
import HoverSelectInput from "../hoverSelect/HoverSelectInput"


type Props<T extends IStringKeyed & IHasName> = {
    values: T[],
    title: string,
    editabilities: Editability<T>[],
}

function inputFocusHandler(event:any) {
    event.target.select()
}

const EditableList = <T extends IStringKeyed & IHasName>({values, title, editabilities, }: Props<T>) => {
    const [openIdx, setOpenIdx] = useState(-1)
    const [isOpenNew, setOpenNew] = useState(false)
    const rowClickHandler = (idx: number) => {
        if (idx === openIdx) {
            setOpenIdx(-1)
        } else {
            setOpenIdx(idx)
        }
    }

    const newSaveHandler = (e: any) => {        
        e.preventDefault()        
    }

    const newHandler = () => {
        setOpenNew(!isOpenNew)       
    }

    const editSaveHandler = (idx: number) => (e: any) => {
        e.preventDefault()        
        const newValue = {...values[idx]}
        editabilities.forEach(x => {
            newValue[x.field] = e.target[x.field].value
        })
        // TODO save newValue   
    }

    const inputSelectHandler = (idx: number, field: keyof T) => (newValue: SelectChoice) => {
        const theValue = values[idx]
    }
    const editableInputs = (v: T, idxRow: number) => {
        return html`${editabilities.filter(x => x.field in v).map((x: Editability<T>, idx: number) => {
            console.log(idx)
            return html`
                <li key=${idx} class="editableListEdit">
                    <span class="editableListColumn">
                        <label>${x.field}</label>
                    </span>
                    <span class="editableListColumn">
                        ${x.fieldType === "choice" 
                            ? html`<${HoverSelectInput} name=${x.field} choices=${x.choices} initValue=${v[x.field]} 
                                uniqueName=${"unique" + x.field + idx} />`
                            : html`<input type="text" name=${x.field} defaultValue=${v[x.field]} 
                                onFocus=${inputFocusHandler} />`
                }
                    </span>
                </li>`
            })}
            `
    }
    return html`
        <div class="editableListContainer">
            <div class="editableListHeader">
                <div class="editableListTitle">
                    <h5>${title}</h5>
                </div>
                <div class="editableListHeaderButton" onClick=${newHandler}>+</div>
            </div>
            <div>
                ${isOpenNew === true && html`
                    <form onSubmit=${newSaveHandler}>
                        <ul>
                            ${editabilities.filter(x => x.field in values[0]).map((x: Editability<T>) => {
                                return html`
                                    <li key=${x.field} class="editableListEdit">
                                        <span class="editableListColumn">
                                            <label>${x.field}</label>
                                        </span>
                                        <span class="editableListColumn">
                                            ${x.fieldType === "choice" 
                                                ? html`<${HoverSelect} choices=${x.choices} currValue=${values[0][x.field]} 
                                                    selectCallback=${inputSelectHandler} />`
                                                : html`<input type="text" name=${x.field} defaultValue=${values[0][x.field]} 
                                                    onFocus=${inputSelectHandler} />`
                                            }                                            
                                        </span>
                                    </li>`
                            })}
                        </ul>
                        <div>
                            <input type="submit" value="Save" />
                        </div>
                    </form>
                `}
            </div>
            <ul>
                ${values.map((v: T, idx: number) => {
                    return html`
                        <li key=${idx} id=${"elem" + idx} class="editableListRow">
                            <div onClick=${() => rowClickHandler(idx)} class=${(openIdx === idx ? " editableListRowActive" : "")}>
                                <span class="editableListCell">${v.name}</span>
                            </div>
                            ${openIdx === idx && html`
                                <form onSubmit=${editSaveHandler(idx)}>
                                    <ul>
                                        ${editableInputs(v, idx)}
                                    </ul>
                                    <div>
                                        <input type="submit" value="Save" />
                                    </div>
                                </form>
                            `}

                        </li>
                    `}
                )}
            </ul>
        </div>
    `
}


export default EditableList