import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "~/plugins/firebase.client";
import { fetchMlkemPublicKeyUint8 } from "~/components/crypto/mlkem-public-key-retriever";
import { MlKem1024 } from "mlkem";
import { silentlyEncryptDataWithTwoCiphersCBC } from "~/utils/twoCiphersSilentMode";

export interface ResponseSenderParams {
  name: string;
  email: string;
  phone: string;
  message: string;
  platform: string;
}

export async function responseSender(
  params: ResponseSenderParams,
): Promise<boolean> {
  try {
    // 1. Encode name, email, phone to base64
    const encodeB64 = (v: string) => btoa(unescape(encodeURIComponent(v)));
    const nameB64 = encodeB64(params.name);
    const emailB64 = encodeB64(params.email);
    const phoneB64 = encodeB64(params.phone);

    // 2. Merge with "," and append message
    const merged = `${nameB64},${emailB64},${phoneB64},${params.message}`;
    const encoded = new TextEncoder().encode(merged);

    // 3. Fetch admin MLKEM public key
    const adminEmail = "server-owner@whatever.xyz";
    const recipientPublicKey = await fetchMlkemPublicKeyUint8(adminEmail);
    if (!recipientPublicKey) {
      console.error("Could not fetch admin MLKEM public key");
      return false;
    }

    // 4. Encapsulate secret
    let encapsulatedSecret;
    try {
      const sender = new MlKem1024();
      const [ct, ssS] = await sender.encap(recipientPublicKey);
      encapsulatedSecret = { ct, ssS };
    } catch (err) {
      console.error("Failed to encapsulate secret:", err);
      return false;
    }
    if (!encapsulatedSecret) return false;
    const { ct, ssS } = encapsulatedSecret;

    // 5. Encrypt the encoded data
    let encryptedResponse: Uint8Array;
    try {
      encryptedResponse = await silentlyEncryptDataWithTwoCiphersCBC(
        encoded,
        ssS,
        125,
      );
    } catch (err) {
      console.error("Encryption failed:", err);
      return false;
    }
    const encryptedResponseBase64 = btoa(
      String.fromCharCode(...encryptedResponse),
    );
    const mlkemCiphertext = btoa(String.fromCharCode(...ct));

    // 6. Prepare Firestore doc
    const docRef = doc(collection(db, `data/${adminEmail}/receivedResponses`));
    const responseData = {
      encryptedResponse: encryptedResponseBase64,
      mlkemCiphertext,
      platform: params.platform,
      submittedAt: serverTimestamp(),
    };

    // 7. Upload to Firestore
    await setDoc(docRef, responseData);

    return true;
  } catch (err) {
    console.error("responseSender error:", err);
    return false;
  }
}
