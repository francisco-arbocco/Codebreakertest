import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.codebreaker.game',
  appName: 'Code Breaker',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic'
  }
};

export default config;