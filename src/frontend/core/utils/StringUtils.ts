import { BASE64 } from "./Constants";

export function checkNonempty(strs: (string | null)[]): string[] {
    const result: string[] = []
    for (let s of strs) {
        if (s !== null && s.length > 0 && s !== "undefined") {
            result.push(s)
        } else {
            return []
        }
    }
    return result;
}

export function base64OfArray(inp: Uint8Array): string {
    const numWhole = Math.floor(inp.length/3)
    const extraBytes = inp.length - (numWhole*3)
    let result = ""
    let i = 0;
    for (; i < numWhole; ++i) {
        result += BASE64[inp[i*3] >> 2]
        result += BASE64[((inp[i*3] & 3) << 4) + (inp[i*3 + 1] >> 4)]
        result += BASE64[((inp[i*3 + 1] & 15) << 2) + (inp[i*3 + 2] >> 6)]
        result += BASE64[inp[i*3 + 2] & 63]
    }
    if (extraBytes == 1) {
        result += BASE64[inp[i*3] >> 2]
        result += BASE64[(inp[i*3] & 3) << 4]
    } else if (extraBytes == 2) {
        result += BASE64[inp[i*3] >> 2]
        result += BASE64[((inp[i*3] & 3) << 4) + (inp[i*3 + 1] >> 4)]
        result += BASE64[(inp[i*3 + 1] & 15) << 2]
    }
    for (let j = 3 - extraBytes; j > 0; --j) {
        result += "="
    }
    return result
}
