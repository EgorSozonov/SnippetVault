import SelectChoice from "../../../types/SelectChoice"

export type Editability<T> = {
    field: keyof T,
    choices?: SelectChoice[],
    fieldType: EditableField,
}

export type EditableField = 
    | "string"
    | "choice"
    | "int"
    | "float"
    | "date"


