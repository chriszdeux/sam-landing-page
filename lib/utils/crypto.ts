export const encryptData = async (data: unknown, secretKey: string) => {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = encoder.encode(JSON.stringify(data));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      const encryptedArray = new Uint8Array(encrypted);
      const result = new Uint8Array(iv.length + encryptedArray.length);
      result.set(iv);
      result.set(encryptedArray, iv.length);

      return btoa(String.fromCharCode(...result));
    }
  } catch (e) {
    console.warn('[CRYPTO] AES encryption failed, falling back to Base64', e);
  }

  // Fallback for non-secure contexts or server-side rendering
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch {
    return '';
  }
};

export const decryptData = async (encryptedBase64: string, secretKey: string) => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const combined = new Uint8Array(
        atob(encryptedBase64).split('').map((c) => c.charCodeAt(0))
      );
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch {
      // If decryption failed, try the fallback format before throwing
    }
  }

  // Fallback decryption
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedBase64)));
  } catch {
    throw new Error('Decryption failed or data corrupted');
  }
};
