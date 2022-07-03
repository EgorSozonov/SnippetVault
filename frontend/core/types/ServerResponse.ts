type ServerResponse<T> = {isOK: false, errMsg: string} | {isOK: true, value: T}

export default ServerResponse
