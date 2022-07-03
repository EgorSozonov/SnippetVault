import React, { useState } from "react"
import IHasName from "../../types/IHasName"
import IStringKeyed from "../../types/IStringKeyed"
import "./editableList.css"
import { Editability } from "./utils/Editability"
import HoverSelectInput from "../hoverSelect/HoverSelectInput"
import { inputFocusHandler } from "../../utils/ComponentUtils"
import { getFieldsFromForm } from "./utils/Utils"


type Props<T extends IStringKeyed & IHasName> = {
    values: T[],
    title: string,
    editabilities: Editability<T>[],
    cuCallback: (newValue: T) => void,
}

const EditableList = <T extends IStringKeyed & IHasName>({values, title, editabilities, cuCallback, }: Props<T>) => {
    if (!values || values.length < 1) return <div></div>
    const [openIdx, setOpenIdx] = useState(-1)
    const [isOpenNew, setOpenNew] = useState(false)

    const rowClickHandler = (idx: number) => () => {
        if (idx === openIdx) {
            setOpenIdx(-1)
        } else {
            setOpenIdx(idx)
        }
    }

    const newSaveHandler = (e: any) => {
        if (!values || values.length < 1) return
        e.preventDefault()
        const formData = new FormData(e.target)
        const newValue = getFieldsFromForm(formData, editabilities, values[0])
        newValue.existingId = -1
        cuCallback(newValue)
    }

    const newHandler = () => {
        setOpenNew(!isOpenNew)
    }

    const editSaveHandler = (idx: number) => (e: any) => {
        if (!values || values.length <= idx) return

        e.preventDefault()
        const formData = new FormData(e.target)
        const newValue = getFieldsFromForm(formData, editabilities, values[idx])
        cuCallback(newValue)
    }

    const editableInputs = (v: T) => {
        return (
            editabilities.filter((x: any) => x.field in v)
                         .map((x: Editability<T>, idx: number) =>
                            <li key={idx} className="editableListEdit">
                                <span className="editableListColumn">
                                    <label>{x.field}</label>
                                </span>
                                <span className="editableListColumn">
                                    {x.fieldType === "choice"
                                        ? <HoverSelectInput inputName={x.field.toString()} choices={x.choices} initValue={v[x.field]}
                                                    uniqueName={"unique" + x.field + idx} />
                                        : (x.fieldType === "bool"
                                            ? <input type="checkbox" className="svCheckbox" name={x.field.toString()} defaultChecked={v[x.field]}/>
                                            : <input type="text" name={x.field.toString()} defaultValue={v[x.field]}
                                            onFocus={inputFocusHandler} />)
                                    }
                                </span>
                            </li>
                         )

        )
    }
    return (
        <div className="editableListContainer">
            <div className="editableListHeader">
                <div className="editableListTitle">
                    <h5>{title}</h5>
                </div>
                <div className="editableListHeaderButton" onClick={newHandler}>+</div>
            </div>
            <div className="editableListAddForm">
                {isOpenNew === true &&
                    <form onSubmit={newSaveHandler}>
                        <ul>
                            {editableInputs(values[0])}
                        </ul>
                        <div className="editableListAddButton">
                            <input type="submit" value="Save new" />
                        </div>
                    </form>
                }
            </div>
            <div>
                <ul>
                    {values.map((v: T, idx: number) => {
                        return (
                            <li key={idx} id={"elem" + idx} className="editableListRow">
                                <div onClick={rowClickHandler(idx)} className={(openIdx === idx ? "editableListRowActive" : "")}>
                                    <span className="editableListCell">{v.name}</span>
                                </div>
                                {openIdx === idx &&
                                    <form onSubmit={editSaveHandler(idx)}>
                                        <ul>
                                            {editableInputs(v)}
                                        </ul>
                                        <div className="editableListSaveButton">
                                            <input type="submit" value="Save" />
                                        </div>
                                    </form>
                                }

                            </li>
                        )}
                    )}
                </ul>
            </div>
        </div>
    )
}


export default EditableList
