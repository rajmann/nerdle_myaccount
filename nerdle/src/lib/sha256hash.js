export async function sha256hash(value) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return new Uint8Array(hash);
}

export async function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (x) => String.fromCharCode(x)).join('');
    return btoa(binString)
}

export async function createHash(value) {
    const hash = await sha256hash(value);
    return bytesToBase64(hash);
}

export const getSHA256Hash = async (input) => {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
      .map((item) => item.toString(16).padStart(2, "0"))
      .join("");
    return hash;
  };