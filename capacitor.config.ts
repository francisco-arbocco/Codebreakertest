import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.lovable.memorygame',
  appName: 'Memory Game',
  webDir: 'dist',
  server: {
    url: 'https://REPLACE_WITH_PROJECT_ID.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;