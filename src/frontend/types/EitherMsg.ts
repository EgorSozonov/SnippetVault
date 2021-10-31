type EitherMsg<T> = {isOK: false, errMsg: string} | {isOK: true, value: T}

export default EitherMsg


