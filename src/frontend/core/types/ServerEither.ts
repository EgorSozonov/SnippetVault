type ServerEither<T> = {isRight: false, errMsg: string} | {isRight: true, value: T}

export default ServerEither
