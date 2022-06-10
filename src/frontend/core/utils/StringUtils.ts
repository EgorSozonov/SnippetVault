import { BASE64, HEX_DIGITS } from "./Constants";
import BI from "jsbi"


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

/**
 * Converts a hex string not prefixed by "0x" to Base64
 */
export function base64OfHex(inp: string): string {
    const matchArray = inp.match(/../g)
    if (matchArray == null) return ""
    const byteArray: Uint8Array = new Uint8Array(matchArray.map(h => parseInt(h, 16)))
    return base64OfArray(byteArray)
}

export function hexOfBase64(inp: string): string {
    let result = hexOfArray(arrayOfBase64(inp))
    return (result.length % 2 === 1) ? "0" + result : result
}

export function bigintOfBase64(inp: string): BI {
    const byteArr = arrayOfBase64(inp);
    const prefixedHex: string = "0x" + (Array.from(byteArr)
                                .map((b) => HEX_DIGITS[b >> 4] + HEX_DIGITS[b & 15])
                                .join(""));
    return BI.BigInt(prefixedHex);
}

/**
 * Takes a non-prefixed, even-length hex string
 */
export function bigintOfHex(inp: string): BI {
    if (inp.startsWith("0")) return BI.BigInt("0x" + inp.substring(1))
    return BI.BigInt("0x" + inp)
}

/**
 * Outputs a string with a "0x" prefix but without necessarily an even number of bytes
 * Userful for creating BigInts from
 */
export function prefixedHexOfArray(inp: Uint8Array): string {
    return "0x" + (Array.from(inp)
                .map((b) => HEX_DIGITS[b >> 4] + HEX_DIGITS[b & 15])
                .join(""));
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

export function arrayOfBase64(inp: string): Uint8Array {
    const resultLength = determineResultLength(inp)
    const result = new Uint8Array(resultLength)
    const fullQuads = inp.charCodeAt(inp.length - 1) === 61 ? inp.length/4 - 1 : inp.length/4

    let i = 0
    for (; i < fullQuads; ++i) {
        const int1 = num64OfBase64(inp.charCodeAt(i*4    ))
        const int2 = num64OfBase64(inp.charCodeAt(i*4 + 1))
        const int3 = num64OfBase64(inp.charCodeAt(i*4 + 2))
        const int4 = num64OfBase64(inp.charCodeAt(i*4 + 3))
        result[i*3    ] = (int1 << 2) + (int2 >> 4)
        result[i*3 + 1] = ((int2 & 15) << 4) + (int3 >> 2)
        result[i*3 + 2] = ((int3 & 3) << 6) + int4
    }
    if ((resultLength - 3*fullQuads) === 1) {
        const int1 = num64OfBase64(inp.charCodeAt(i*4    ))
        const secondCode = inp.charCodeAt(i*4 + 1)
        const int2 = secondCode === 61 ? 0 : num64OfBase64(secondCode) // It might be padding
        result[i*3    ] = (int1 << 2) + (int2 >> 4)
    } else if ((resultLength - 3*fullQuads) === 2) {
        const int1 = num64OfBase64(inp.charCodeAt(i*4    ))
        const int2 = num64OfBase64(inp.charCodeAt(i*4 + 1))
        result[i*3    ] = (int1 << 2) + (int2 >> 4)

        const thirdCode = inp.charCodeAt(i*4 + 2)
        const int3 = thirdCode === 61 ? 0 : num64OfBase64(thirdCode) // It might be padding
        result[i*3 + 1] = ((int2 & 15) << 4) + (int3 >> 2)
    } else {
        const int1 = num64OfBase64(inp.charCodeAt(i*4    ))
        const int2 = num64OfBase64(inp.charCodeAt(i*4 + 1))
        const int3 = num64OfBase64(inp.charCodeAt(i*4 + 2))
        const lastCode = inp.charCodeAt(i*4 + 3)
        const int4 = lastCode === 61 ? 0 : num64OfBase64(lastCode) // It might be padding
        result[i*3    ] = (int1 << 2) + (int2 >> 6)
        result[i*3 + 1] = ((int2 & 15) << 4) + (int3 >> 2)
        result[i*3 + 2] = ((int3 & 3) << 6) + int4
    }
    return result
}

/**
 * The number from 0 to 63 that is a decoding of a Base64 char
 */
function num64OfBase64(charCode: number): number {
    if (charCode === 43) {        // +
        return 62
    } else if (charCode === 47) { // /
        return 63
    } else if (charCode <= 57) {  // digits
        return (charCode + 4)     // - 48 + 52
    } else if (charCode <= 90) {  // capital letters
        return (charCode - 65)
    } else {                      // small letters
        return (charCode - 71)    // - 97 + 26
    }
}

export function determineResultLength(inp: string): number {
    let numPadding = 0
    for (let i = inp.length - 1; inp[i] === '='; --i) { ++numPadding }
    if (numPadding === 0) {
        return inp.length*3/4
    } else if (numPadding === 1) {
        const penult = num64OfBase64(inp.charCodeAt(inp.length - 2))
        return (penult & 3) > 0 ? inp.length*3/4 : inp.length*3/4 - 1
    } else { // numPadding === 2
        const elem = num64OfBase64(inp.charCodeAt(inp.length - 3))
        return (elem & 15) > 0 ? (inp.length*3/4 - 1) : (inp.length*3/4 - 2)
    }
}

/**
 * Convert BigInt to a hex string with the "0x" prefix.
 * Correctly prepends zero to get an even number of chars.
 * Because of JokeScript's deficiencies, negative BigInts are not handled correctly.
 */
export function prefixedHexOfPositiveBI(inp: BI): string {
    let str = inp.toString(16)
    return (str.length % 2 === 0) ? ("0x" + str) : ("0x0" + str)
}

/**
 * Convert BigInt to a hex string with the "0x" prefix.
 * Correctly prepends zero to get an even number of chars.
 * Because of JokeScript's deficiencies, negative BigInts are not handled correctly.
 */
export function nonprefixedHexOfPositiveBI(inp: BI): string {
    let str = inp.toString(16)
    return (str.length % 2 === 0) ? str : ("0" + str)
}


export function hexOfArray(inp: Uint8Array): string {
    let result = ""
    for (let i = 0; i < inp.length; ++i) {
        result = result + inp[i].toString(16).padStart(2, "0")
     }
    return result
}
