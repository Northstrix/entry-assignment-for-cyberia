import { collection, getDocs } from "firebase/firestore";
import { db } from "~/plugins/firebase.client";
import { decryptFieldValueWithTwoCiphersCBC } from "~/utils/twoCiphersSilentMode";
import { MlKem1024 } from "mlkem";

export interface DecryptedResponse {
  id: string; // <-- Add this
  name: string;
  email: string;
  phone: string;
  message: string;
  platform: string;
  submittedAt: Date | null;
  integrityFailed: boolean;
}

export async function fetchAndDecryptResponses(
  mlkemPrivateKey: Uint8Array,
  ownerEmail: string,
): Promise<DecryptedResponse[]> {
  const responsesRef = collection(db, `data/${ownerEmail}/receivedResponses`);
  const snapshot = await getDocs(responsesRef);
  const records: DecryptedResponse[] = [];

  const decapsulateSecret = async (
    ct: Uint8Array,
    skR: Uint8Array,
  ): Promise<Uint8Array | undefined> => {
    try {
      const recipient = new MlKem1024();
      const ssR = await recipient.decap(ct, skR);
      return ssR;
    } catch (err) {
      console.error("Failed to decapsulate secret:", (err as Error).message);
    }
  };

  const base64ToUint8Array = (base64: string): Uint8Array => {
    try {
      const binaryString = atob(base64);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      return uint8Array;
    } catch (error) {
      console.warn(error);
      return new Uint8Array([1]);
    }
  };

  function decodeB64(s: string) {
    try {
      return decodeURIComponent(escape(atob(s)));
    } catch (e) {
      return "(decode error)";
    }
  }

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.encryptedResponse || !data.mlkemCiphertext) continue;

    let ssS: Uint8Array | undefined;
    let integrityFailed = false;
    let decrypted: string = "";

    try {
      const ct = base64ToUint8Array(data.mlkemCiphertext);
      ssS = await decapsulateSecret(ct, mlkemPrivateKey);
      if (!ssS) {
        records.push({
          id: docSnap.id,
          name: "(decapsulation error)",
          email: "",
          phone: "",
          message: "",
          platform: data.platform || "",
          submittedAt: data.submittedAt?.toDate
            ? data.submittedAt.toDate()
            : null,
          integrityFailed: true,
        });
        continue;
      }
    } catch (e) {
      records.push({
        id: docSnap.id,
        name: "(decapsulation error)",
        email: "",
        phone: "",
        message: "",
        platform: data.platform || "",
        submittedAt: data.submittedAt?.toDate
          ? data.submittedAt.toDate()
          : null,
        integrityFailed: true,
      });
      continue;
    }

    try {
      const encryptedResponse = base64ToUint8Array(data.encryptedResponse);
      const [decryptedUint8, integrity] =
        await decryptFieldValueWithTwoCiphersCBC(encryptedResponse, ssS, 125);
      integrityFailed = !integrity || !decryptedUint8;
      decrypted = decryptedUint8
        ? new TextDecoder().decode(decryptedUint8)
        : "";
    } catch (e) {
      records.push({
        id: docSnap.id,
        name: "(decryption error)",
        email: "",
        phone: "",
        message: "",
        platform: data.platform || "",
        submittedAt: data.submittedAt?.toDate
          ? data.submittedAt.toDate()
          : null,
        integrityFailed: true,
      });
      continue;
    }

    // Split and decode fields
    const firstComma = decrypted.indexOf(",");
    const secondComma = decrypted.indexOf(",", firstComma + 1);
    const thirdComma = decrypted.indexOf(",", secondComma + 1);

    if (firstComma === -1 || secondComma === -1 || thirdComma === -1) {
      records.push({
        id: docSnap.id,
        name: "(format error)",
        email: "",
        phone: "",
        message: decrypted,
        platform: data.platform || "",
        submittedAt: data.submittedAt?.toDate
          ? data.submittedAt.toDate()
          : null,
        integrityFailed: true,
      });
      continue;
    }

    const nameB64 = decrypted.slice(0, firstComma);
    const emailB64 = decrypted.slice(firstComma + 1, secondComma);
    const phoneB64 = decrypted.slice(secondComma + 1, thirdComma);
    const message = decrypted.slice(thirdComma + 1);

    records.push({
      id: docSnap.id,
      name: decodeB64(nameB64),
      email: decodeB64(emailB64),
      phone: decodeB64(phoneB64),
      message,
      platform: data.platform || "",
      submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : null,
      integrityFailed,
    });
  }

  // Sort by submittedAt desc
  return records.sort((a, b) => {
    if (!a.submittedAt && !b.submittedAt) return 0;
    if (!a.submittedAt) return 1;
    if (!b.submittedAt) return -1;
    return b.submittedAt.getTime() - a.submittedAt.getTime();
  });
}
