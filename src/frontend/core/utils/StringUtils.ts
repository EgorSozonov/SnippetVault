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

/**
 * Non-prefixed hex string with an even length
 */
export function hexOfBase64(inp: string): string {
    return trimHexZeroes(hexOfArray(arrayOfBase64(inp)))
}

/**
 * Trims leading zeroes from a non-prefixed hex string to guarantee the following:
 * 1) even number of digits 2) no more than one zero in prefix
 */
function trimHexZeroes(inp: string): string {
    let countZeroes = 0
    for (; countZeroes < inp.length && inp[countZeroes] === "0"; ++countZeroes) {}
    if (countZeroes > 0) {
        return (inp.length - countZeroes) % 2 === 0
                ? inp.substring(countZeroes)
                : inp.substring(countZeroes - 1)
    } else {
        return inp.length % 2 === 0
                ? inp
                : ("0" + inp)
    }
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
    const paddingChars = determinePadding(inp)
    const resultLength = paddingChars == 0
                            ? inp.length/4*3
                            : (paddingChars == 1
                                ? (inp.length/4*3 - 1)
                                : (inp.length/4*3 - 2))
    const result = new Uint8Array(resultLength)
    let fullQuads = paddingChars === 0 ? inp.length/4 : inp.length/4 - 1
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

    if (paddingChars === 1) {
        const int1 = num64OfBase64(inp.charCodeAt(i*4    ))
        const int2 = num64OfBase64(inp.charCodeAt(i*4 + 1))
        result[i*3    ] = (int1 << 2) + (int2 >> 4)

        const int3 = num64OfBase64(inp.charCodeAt(i*4 + 2))
        result[i*3 + 1] = ((int2 & 15) << 4) + (int3 >> 2)

    } else if (paddingChars === 2) {
        const int1 = num64OfBase64(inp.charCodeAt(i*4    ))
        const int2 = num64OfBase64(inp.charCodeAt(i*4 + 1))
        result[i*3    ] = (int1 << 2) + (int2 >> 4)
    }
    return result
}

// BHex snippetVault.js:4482:21
// 00957b8d7ed1bd8bc0ff5f35407a608faab385c2a2731f3bf862132fe9d3ade1d54ce0a67aff4dca423a03cce658018edad108aad9e08f391b51386715acd3e9889eb5f736cc29c0c291f04c9f52c8cd01123ec83735d9a502eac84b7939ca83ddaf78a02fc0441d15d8adfb1c4c16b33c1bd16c07a7117480c9e63470c2172dccbf3c9cd781e09fd8a58aba39cbc443f408eae23a0cee99efac2c1730c0240a49dd2e130a8696a21cdecf2caf1ed2d0c26695950c3ebd2ef43e2c2aa92388e405878d44bcc7a5f2e70ecb1672a70e0ae6b95ec47e5d3fd221bcd1b1410689cdda7b4d2c9c8ee131443ce4b26fbcb76de423de393452ee0df5496d55b3e89c0b16
// 00010110
// BHex on server
//957b8d7ed1bd8bc0ff5f35407a608faab385c2a2731f3bf862132fe9d3ade1d54ce0a67aff4dca423a03cce658018edad108aad9e08f391b51386715acd3e9889eb5f736cc29c0c291f04c9f52c8cd01123ec83735d9a502eac84b7939ca83ddaf78a02fc0441d15d8adfb1c4c16b33c1bd16c07a7117480c9e63470c2172dccbf3c9cd781e09fd8a58aba39cbc443f408eae23a0cee99efac2c1730c0240a49dd2e130a8696a21cdecf2caf1ed2d0c26695950c3ebd2ef43e2c2aa92388e405878d44bcc7a5f2e70ecb1672a70e0ae6b95ec47e5d3fd221bcd1b1410689cdda7b4d2c9c8ee131443ce4b26fbcb76de423de393452ee0df5496d55b3e89c0b16


// client input for hash for u = 6bb4c0318719b400cf74a714d6c264f63af3cab45af037e4f58809f95601ae589e21efda199bc5cfb3a752fc69e1da0301c4f3190794f4ab59323def1c2a42a6e447303378f8650e9ecc172465e50eb04875e343f87e293979cbab9036c0dff36782647d6baa341d898fbed659b04cd92fbb7dac418e438cac402527d3588909ca8cc3c5428b55f9d442f82efacf4dd6d4c7528fde143cb5ccfa1a0b804fc753a0955d54c12dde45b92925c8cde77598160897ae8637599e8bc99b135511d2b831966ed36f5e5f4a3d7c9d7c1ab4f89504c4ad658f5843f536c7452a580d0e39fab0ea5b9c9cf56ad49b0f9fcc154b39a87fb7305bfceb06abfcd350ed67f19700957b8d7ed1bd8bc0ff5f35407a608faab385c2a2731f3bf862132fe9d3ade1d54ce0a67aff4dca423a03cce658018edad108aad9e08f391b51386715acd3e9889eb5f736cc29c0c291f04c9f52c8cd01123ec83735d9a502eac84b7939ca83ddaf78a02fc0441d15d8adfb1c4c16b33c1bd16c07a7117480c9e63470c2172dccbf3c9cd781e09fd8a58aba39cbc443f408eae23a0cee99efac2c1730c0240a49dd2e130a8696a21cdecf2caf1ed2d0c26695950c3ebd2ef43e2c2aa92388e405878d44bcc7a5f2e70ecb1672a70e0ae6b95ec47e5d3fd221bcd1b1410689cdda7b4d2c9c8ee131443ce4b26fbcb76de423de393452ee0df5496d55b3e89c0b16 snippetVault.js:4485:21
// client u = 41220643372896632781098746166916296939354256618159039976406104219897479266229


// B for u = 957b8d7ed1bd8bc0ff5f35407a608faab385c2a2731f3bf862132fe9d3ade1d54ce0a67aff4dca423a03cce658018edad108aad9e08f391b51386715acd3e9889eb5f736cc29c0c291f04c9f52c8cd01123ec83735d9a502eac84b7939ca83ddaf78a02fc0441d15d8adfb1c4c16b33c1bd16c07a7117480c9e63470c2172dccbf3c9cd781e09fd8a58aba39cbc443f408eae23a0cee99efac2c1730c0240a49dd2e130a8696a21cdecf2caf1ed2d0c26695950c3ebd2ef43e2c2aa92388e405878d44bcc7a5f2e70ecb1672a70e0ae6b95ec47e5d3fd221bcd1b1410689cdda7b4d2c9c8ee131443ce4b26fbcb76de423de393452ee0df5496d55b3e89c0b16
// Server input to hash function for u
// 6bb4c0318719b400cf74a714d6c264f63af3cab45af037e4f58809f95601ae589e21efda199bc5cfb3a752fc69e1da0301c4f3190794f4ab59323def1c2a42a6e447303378f8650e9ecc172465e50eb04875e343f87e293979cbab9036c0dff36782647d6baa341d898fbed659b04cd92fbb7dac418e438cac402527d3588909ca8cc3c5428b55f9d442f82efacf4dd6d4c7528fde143cb5ccfa1a0b804fc753a0955d54c12dde45b92925c8cde77598160897ae8637599e8bc99b135511d2b831966ed36f5e5f4a3d7c9d7c1ab4f89504c4ad658f5843f536c7452a580d0e39fab0ea5b9c9cf56ad49b0f9fcc154b39a87fb7305bfceb06abfcd350ed67f197957b8d7ed1bd8bc0ff5f35407a608faab385c2a2731f3bf862132fe9d3ade1d54ce0a67aff4dca423a03cce658018edad108aad9e08f391b51386715acd3e9889eb5f736cc29c0c291f04c9f52c8cd01123ec83735d9a502eac84b7939ca83ddaf78a02fc0441d15d8adfb1c4c16b33c1bd16c07a7117480c9e63470c2172dccbf3c9cd781e09fd8a58aba39cbc443f408eae23a0cee99efac2c1730c0240a49dd2e130a8696a21cdecf2caf1ed2d0c26695950c3ebd2ef43e2c2aa92388e405878d44bcc7a5f2e70ecb1672a70e0ae6b95ec47e5d3fd221bcd1b1410689cdda7b4d2c9c8ee131443ce4b26fbcb76de423de393452ee0df5496d55b3e89c0b16

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

export function determinePadding(inp: string): number {
    let result = 0
    for (let i = inp.length - 1; i > -1 && inp[i] === '='; --i) { ++result }
    return result
}

/**
 * Convert BigInt to a hex string with the "0x" prefix.
 * Correctly prepends zero to get an even number of chars.
 * Because of JokeScript's deficiencies, negative BigInts are not handled correctly.
 */
export function prefixedHexOfPositiveBI(inp: BI): string {
    let str = inp.toString(16)
    return (str.length % 2 === 0)
                ? ("0x" + str)
                : (str.startsWith("0")
                    ? ("0x" + str.substring(1))
                    : ("0x0" + str))
}

export function prefixedHexOfBuff(inp: ArrayBuffer): string {
    return "0x" + (Array.from(new Uint8Array(inp)))
                .map((b) => HEX_DIGITS[b >> 4] + HEX_DIGITS[b & 15])
                .join("");
}

export function hexOfBuff(inp: ArrayBuffer): string {
    return hexOfArray(new Uint8Array(inp))
}

/**
 * Convert BigInt to a hex string without the "0x" prefix.
 * Correctly prepends zero to get an even number of chars.
 * Because of JokeScript's deficiencies, negative BigInts are not handled correctly.
 */
export function nonprefixedHexOfPositiveBI(inp: BI): string {
    let str = inp.toString(16)
    return (str.length % 2 === 0) ? str : (str.startsWith("0") ? str.substring(1) : ("0" + str))
}


export function hexOfArray(inp: Uint8Array): string {
    let result = ""
    for (let i = 0; i < inp.length; ++i) {
        result = result + inp[i].toString(16).padStart(2, "0")
    }
    return result
}
