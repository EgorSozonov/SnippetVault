import SelectGroup from "../../types/SelectGroup"
import EitherMsg from "../../types/EitherMsg"
import SelectChoice from "../../types/SelectChoice"
import { LanguageDTO } from "../../types/dto/AuxDTO"


export function sortLanguages(langs: LanguageDTO[]): SelectChoice[] {
    const result = langs.sort((x, y) => {
        if (x.sortingOrder === y.sortingOrder) {
            return x.code.localeCompare(y.code)
        } else if (x.sortingOrder < y.sortingOrder) {
            return -1;
        } else {
            return 1;
        }
    })

    return result
}
