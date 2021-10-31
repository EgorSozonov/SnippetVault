import LanguageDTO from "../../common/dto/LanguageDTO"
import { match, select, when, not, __ } from 'ts-pattern';

type EitherMsg<T> = {isOK: false, errMsg: string} | {isOK: true, value: T}

function bar(x: EitherMsg<LanguageDTO[]>) {
    return match<EitherMsg<LanguageDTO[]>, string>(x)
        .with({isOK: false}, (res) => res.errMsg)
        .with({isOK: true}, (res) => res.value[0].languageGroup)
    }

