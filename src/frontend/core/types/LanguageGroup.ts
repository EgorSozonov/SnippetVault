import LanguageGroupedDTO from "../types/dto/LanguageGroupedDTO";

type LanguageGroup = {
    name: string,
    languages: LanguageGroupedDTO[],
}

export default LanguageGroup