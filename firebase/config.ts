import { getFunctions } from "@react-native-firebase/functions";

// Configure Firebase to use local emulators in development
export const configureFirebaseEmulators = () => {
  if (__DEV__) {
    try {
      // Configure Firestore emulator
      // const db = getFirestore();
      // connectFirestoreEmulator(db, "localhost", 8080);

      // Configure Functions emulator
      // Use localhost for emulator, IP for real device
      const host = "localhost";
      // const host = "192.168.110.231";
      getFunctions().useEmulator(host, 5001);

      console.log(`✅ Firebase emulators configured (host: ${host})`);
    } catch (error) {
      console.log("⚠️ Firebase emulators already connected or not available");
    }
  }
};
