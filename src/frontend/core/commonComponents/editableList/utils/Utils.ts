import IHasName from "../../../types/IHasName"
import IStringKeyed from "../../../types/IStringKeyed"
import { Editability } from "./Editability"


export function getFieldsFromForm<T extends IStringKeyed & IHasName>(formData: FormData, editabilities: Editability<T>[], initValue: T): T {
    const result = {...initValue}
    editabilities.forEach(ed => {
        if (ed.fieldType === "choice") {
            const newChoiceInd: number = ed.choices!!.findIndex(x => x.name === formData.get(ed.field.toString()))
            result[ed.field] = ed.choices!![newChoiceInd] as any
        } else if (ed.fieldType === "bool") {
            result[ed.field] = formData.has(ed.field.toString()) as any
        } else {
            result[ed.field] = formData.get(ed.field.toString()) as any
        }
    })
    return result
}
