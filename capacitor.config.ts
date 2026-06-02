import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nolea.shop',
  appName: 'Nolea',
  webDir: 'dist',

  // Server config — wird für lokales Dev via `npx cap run` gebraucht
  // Im Production-Build zeigt die App auf nolea.shop
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },

  // Splash Screen Setup
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#FAF8F2',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#FAF8F2',
    },
  },

  android: {
    backgroundColor: '#FAF8F2',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  ios: {
    contentInset: 'automatic',
    backgroundColor: '#FAF8F2',
    limitsNavigationsToAppBoundDomains: true,
  },
};

export default config;
