import { auth, db } from "~/plugins/firebase.client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { silentlyDecryptDataWithTwoCiphersCBC } from "~/utils/twoCiphersSilentMode";
import { encryptSerpent256ECB } from "~/utils/serpent.js";
import { argon2id, whirlpool, sha512 } from "hash-wasm";

const hexStringToArray = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g);
  if (!matches) throw new Error("Invalid hexadecimal string");
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

const arrayToHexString = (byteArray: Uint8Array): string => {
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const base64ToUint8Array = (b64: string): Uint8Array => {
  const bin = atob(b64);
  return new Uint8Array([...bin].map((ch) => ch.charCodeAt(0)));
};

export const handleSignInContinue = async (
  email: string,
  password: string,
): Promise<Uint8Array | false> => {
  try {
    // Key derivation (same as signup)
    const sha512EmailOutput = await sha512(email);
    const sha512EmailArray = hexStringToArray(sha512EmailOutput);
    const emailByteArray = new Uint8Array(sha512EmailArray);
    const emailWhirlpoolHash = await whirlpool(emailByteArray);
    const hashedEmailSalt = new Uint8Array(
      hexStringToArray(emailWhirlpoolHash),
    );

    const sha512PasswordOutput = await sha512(password);
    const sha512PasswordArray = hexStringToArray(sha512PasswordOutput);
    const passwordByteArray = new Uint8Array(sha512PasswordArray);
    const passwordWhirlpoolHash = await whirlpool(passwordByteArray);
    const hashedPassword = new Uint8Array(
      hexStringToArray(passwordWhirlpoolHash),
    );

    const iterationBytes = hashedPassword;
    const derIterations = iterationBytes.reduce((acc, val) => acc + val, 0);
    const iterations = 1100 + (derIterations % (1400 - 1100 + 1));

    const saltLength = Math.min(hashedEmailSalt.length, hashedPassword.length);
    const finalSalt = new Uint8Array(saltLength);
    for (let i = 0; i < saltLength; i++) {
      finalSalt[i] = hashedEmailSalt[i] ^ hashedPassword[i];
    }

    const derivedKey: Uint8Array = await argon2id({
      password,
      salt: finalSalt,
      iterations,
      memorySize: 512,
      hashLength: 336,
      parallelism: 1,
      outputType: "binary",
    });

    const userID1 = derivedKey.slice(0, 16);
    const userID2 = derivedKey.slice(16, 32);
    const unencryptedPassword = userID1.map(
      (byte, index) => byte ^ userID2[index],
    );
    const userCredentialEncryptionKey = derivedKey.slice(32, 64);
    const encryptedUserPassword = encryptSerpent256ECB(
      unencryptedPassword,
      userCredentialEncryptionKey,
    );

    // Calculate cutIterations
    const cutIterations = parseInt((iterations / 9).toString(), 10);

    // Debug info (not returned)
    console.log(
      "Derived master key (derivedKey.slice(64)):",
      derivedKey.slice(64),
    );
    console.log("cutIterations:", cutIterations);

    // Sign in
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        arrayToHexString(encryptedUserPassword),
      );
    } catch (error) {
      console.error("Sign in failed:", error);
      return false;
    }

    // Get and decrypt MLKEM private key
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated after sign in");
      return false;
    }

    const keyDocRef = doc(
      db,
      "data",
      `${user.email}/private/encrypted/keyring/mlkem-private-key`,
    );
    const keyDoc = await getDoc(keyDocRef);
    if (!keyDoc.exists()) {
      console.error("Can't access MLKEM private key");
      return false;
    }
    const keyData = keyDoc.data();
    if (!keyData || !keyData.privateKey) {
      console.error("MLKEM private key field missing");
      return false;
    }

    // Decode from base64 before decrypting!
    const encryptedMlKemPrivateKey = base64ToUint8Array(keyData.privateKey);
    const [decryptedPrivateKey, integrity] =
      await silentlyDecryptDataWithTwoCiphersCBC(
        encryptedMlKemPrivateKey,
        derivedKey.slice(64),
        cutIterations,
      );

    // integrity: true means integrity failed!
    if (integrity || !decryptedPrivateKey) {
      console.error("Decrypted MLKEM private key corrupted");
      return false;
    }

    return decryptedPrivateKey;
  } catch (error) {
    console.error("Unexpected error in handleSignInContinue:", error);
    return false;
  }
};
