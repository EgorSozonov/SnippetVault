import LanguageGroupedDTO from "../../common/dto/LanguageGroupedDTO";

type LanguageGroup = {
    name: string,
    languages: LanguageGroupedDTO[],
}

export default LanguageGroup