import { auth, db } from "~/plugins/firebase.client"; // or '~/utils/firebase' if that's your path
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { MlKem1024 } from "mlkem";
import { silentlyEncryptDataWithTwoCiphersCBCnoPadding } from "~/utils/twoCiphersSilentMode";
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

export const handleSignUpContinue = async (
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    // Hash the email and password
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

    // Derive iterations
    const iterationBytes = hashedPassword;
    const derIterations = iterationBytes.reduce((acc, val) => acc + val, 0);
    const iterations = 1100 + (derIterations % (1400 - 1100 + 1));

    // Final salt: XOR of hashed email salt and hashed password
    const saltLength = Math.min(hashedEmailSalt.length, hashedPassword.length);
    const finalSalt = new Uint8Array(saltLength);
    for (let i = 0; i < saltLength; i++) {
      finalSalt[i] = hashedEmailSalt[i] ^ hashedPassword[i];
    }

    // Key derivation using Argon2id (returns at least 64 bytes)
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

    const cut_iterations = parseInt((iterations / 9).toString(), 10);

    // Register user
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        arrayToHexString(encryptedUserPassword),
      );
    } catch (error) {
      console.error("User registration error:", error);
      return false;
    }

    // Sign in user
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        arrayToHexString(encryptedUserPassword),
      );
    } catch (error) {
      console.error("Sign in after registration failed:", error);
      return false;
    }

    const user = auth.currentUser;
    if (!user) {
      console.error(
        "Unable to log in to the newly created account. The MLKEM key setup has failed.",
      );
      return false;
    }

    // MLKEM key generation and storage
    try {
      const recipient = new MlKem1024();
      const [pkR, skR] = await recipient.generateKeyPair();
      const publicKey = btoa(String.fromCharCode(...pkR));
      const publicKeyData = { publicKey };
      const docRef = doc(
        collection(db, "data"),
        `${user.email}/public/mlkem-public-key`,
      );
      await setDoc(docRef, publicKeyData);

      // Encrypt MLKEM private key
      const encryptedPrivateKey =
        await silentlyEncryptDataWithTwoCiphersCBCnoPadding(
          skR,
          derivedKey.slice(64),
          cut_iterations,
        );
      const privateKey = btoa(String.fromCharCode(...encryptedPrivateKey));
      const privateKeyData = { privateKey };
      const privateDocRef = doc(
        collection(db, "data"),
        `${user.email}/private/encrypted/keyring/mlkem-private-key`,
      );
      await setDoc(privateDocRef, privateKeyData);

      await auth.signOut();
      return true;
    } catch (error) {
      console.error("Failed to upload MLKEM keys to Firebase:", error);
      return false;
    }
  } catch (error) {
    console.error("Unexpected error in handleSignUpContinue:", error);
    return false;
  }
};
