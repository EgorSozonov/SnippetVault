import { useState } from "react"
import HasName from "../../interfaces/hasName"
import StringKeyed from "../../interfaces/stringKeyed"
import "./editableList.css"


type Props<T extends StringKeyed & HasName> = {
    values: T[],
    title: string,
}

const EditableList = <T extends StringKeyed & HasName>({values, title, }: Props<T>) => {
    const [openIdx, setOpenIdx] = useState(-1)
    const rowClickHandler = (idx: number) => {
        if (idx === openIdx) {
            setOpenIdx(-1)
        } else {
            setOpenIdx(idx)
        }
    }

    return (
        <div className="editableListContainer">
            <div className="editableListHeader">
                <div className="editableListTitle"><h5>{title}</h5></div>
                <div className="editableListHeaderButton">+</div>
            </div>
            
            <ul>
                {values.map((v: T, idx: number) => {
                    return (
                    <li key={idx} className="editableListRow">
                        <div onClick={() => rowClickHandler(idx)} className={(openIdx === idx ? " editableListRowActive" : "")}>
                            <span className="editableListCell">{v.name}</span>
                        </div>
                        {openIdx === idx &&
                            <ul>
                                {Object.keys(v).map((k: string, idxKey: number) => {
                                    return (
                                        <li key={idxKey} className="editableListEdit">
                                            <span><label>{k}</label></span>
                                            <span><input type="text" defaultValue={v[k]} onFocus={(event) => event.target.select()} />
                                            </span>
                                            <span><button>Save</button></span>
                                        
                                        </li>)
                                })}
                            </ul>
                        }
                    </li>)
                })}
            </ul>
        </div>
    )
}


export default EditableList