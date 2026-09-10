// Safe wrapper for @react-native-google-signin/google-signin
// Protects against crash in Expo Go / Web / environments where native TurboModule RNGoogleSignin is not compiled

let GoogleSignin: any = null;
let statusCodes: any = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};
let isGoogleSigninAvailable = false;

try {
  // Dynamically require to intercept TurboModule getEnforcing crash at module evaluation
  const gModule = require('@react-native-google-signin/google-signin');
  if (gModule && gModule.GoogleSignin) {
    GoogleSignin = gModule.GoogleSignin;
    statusCodes = gModule.statusCodes || statusCodes;
    isGoogleSigninAvailable = true;
  }
} catch (err) {
  // TurboModuleRegistry.getEnforcing('RNGoogleSignin') throws in Expo Go or Web
  console.warn(
    '[GoogleSignin] Native TurboModule RNGoogleSignin is not available in this environment (e.g. Expo Go / Web).'
  );
  GoogleSignin = null;
  isGoogleSigninAvailable = false;
}

export { GoogleSignin, statusCodes, isGoogleSigninAvailable };
