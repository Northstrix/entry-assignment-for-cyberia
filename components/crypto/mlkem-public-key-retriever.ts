import { useNuxtApp } from "#app";
import { doc, getDoc, Firestore } from "firebase/firestore";

export async function fetchMlkemPublicKeyUint8(
  email: string = "server-owner@whatever.xyz",
): Promise<Uint8Array | null> {
  const { $firebaseDb } = useNuxtApp();
  // 👇 Tell TypeScript this is a Firestore instance
  const db = $firebaseDb as Firestore;

  try {
    const docRef = doc(db, "data", `${email}/public/mlkem-public-key`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.publicKey) {
        const binaryString = atob(data.publicKey);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      } else {
        console.error("MLKEM public key not found in Firestore document.");
        return null;
      }
    } else {
      console.error("MLKEM public key document does not exist in Firestore.");
      return null;
    }
  } catch (e: any) {
    console.error("Error retrieving MLKEM public key:", e?.message ?? e);
    return null;
  }
}
