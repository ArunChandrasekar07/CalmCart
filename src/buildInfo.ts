// Overwritten by .github/workflows/build-apk.yml right before each CI build
// with the real commit it's building, so a running app can report exactly
// which build it is. Stays 'dev' for local/Expo Go runs.
export const BUILD_ID = 'dev';
