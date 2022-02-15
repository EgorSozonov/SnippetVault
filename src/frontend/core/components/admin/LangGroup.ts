import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import PATHS from "../../params/Path"
import { html } from "htm/react"
import EditableList from "../../commonComponents/editableList/EditableList"
import { Editability } from "../../commonComponents/editableList/utils/Editability"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { LanguageGroupDTO } from "../../types/dto/AuxDTO"


const ListLGs = (props: any) => EditableList<LanguageGroupDTO>(props)
const editabilityName: Editability<LanguageGroupDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    },
]
function LangGroup() {
    const state = useContext<MainState>(StoreContext)
    return html`
        <div>Hello world group
            <p>
                <${NavLink} to=${PATHS["admin"].url}>
                    <div class="adminHeader">Back to admin</div>
                <//>
            </p>
        </div>
        <div>
            <${ListLGs} values=${state.app.languageGroups} editabilities=${editabilityName} title="Task groups" />
        </div>
    `
}

export default LangGroup
