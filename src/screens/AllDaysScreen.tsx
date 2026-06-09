import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlanDayCard } from '../components/PlanDayCard';
import { Screen } from '../components/Screen';
import { trainingPlan } from '../plan/trainingPlan';
import type { DateKey } from '../plan/types';
import { colors, spacing } from '../theme/tokens';
import { formatUsMonth } from '../utils/dates';

export const AllDaysScreen = ({ onSelect, onClose }: { onSelect: (date: DateKey) => void; onClose: () => void }) => {
  let currentMonth = '';
  return (
    <Screen>
      <Text style={styles.title}>Browse All Days</Text>
      <Text style={styles.detail}>Every day from June 8 through both Dallas events.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to Selected Day" onPress={onClose} style={styles.back}>
        <Text style={styles.backText}>Back to Selected Day</Text>
      </Pressable>
      {trainingPlan.map((day) => {
        const month = formatUsMonth(day.date);
        const heading = month !== currentMonth;
        currentMonth = month;
        return <View key={day.date} style={styles.group}>{heading ? <Text style={styles.month}>{month}</Text> : null}<PlanDayCard day={day} onPress={() => onSelect(day.date)} /></View>;
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  detail: { color: colors.muted, fontSize: 14 },
  back: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderRadius: 10, borderWidth: 1, justifyContent: 'center', minHeight: 50, paddingHorizontal: spacing.md },
  backText: { color: colors.text, fontSize: 14, fontWeight: '900' },
  group: { gap: spacing.sm },
  month: { color: colors.gold, fontSize: 22, fontWeight: '900', marginTop: spacing.md },
});
