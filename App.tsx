import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DailyPlanScreen } from './src/screens/DailyPlanScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <DailyPlanScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
