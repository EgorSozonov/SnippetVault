import LanguageDTO from "../../../common/dto/LanguageDTO";
import SelectGroup from "../../../common/types/SelectGroup";
import LanguageGroup from "../../types/LanguageGroup";


function groupLanguages(langs: LanguageDTO[]): SelectGroup[] {    
    const sortedArr = langs.sort((x, y) => x.languageGroup === y.languageGroup ? 0 : (x.languageGroup < y.languageGroup ? -1 : 1))
    const result: SelectGroup[] = sortedArr.reduce((acc: SelectGroup[], x: LanguageDTO) => {
        if (x.languageGroup !== acc[acc.length - 1].name) {
            result.push({id: 1, name: x.languageGroup, choices: [x]})
        } else {
            acc[acc.length - 1].choices.push(x)
        }
        return acc
    }, [])
    return result

}