import { Pressable, StyleSheet, Text } from 'react-native';

import type { DailyPlan } from '../plan/types';
import { colors, radius, spacing } from '../theme/tokens';
import { formatUsDate } from '../utils/dates';

export const PlanDayCard = ({ day, onPress }: { day: DailyPlan; onPress: () => void }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={`Open ${formatUsDate(day.date)}`} onPress={onPress} style={styles.card}>
    <Text style={styles.day}>Day {day.dayNumber} - {formatUsDate(day.date)}</Text>
    <Text style={styles.title}>{day.title}</Text>
    <Text style={styles.summary}>Tony: {day.tony.summary}</Text>
    <Text style={styles.summary}>Liz: {day.liz.summary}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, gap: spacing.xs, padding: spacing.md },
  day: { color: colors.lime, fontSize: 12, fontWeight: '900' },
  title: { color: colors.text, fontSize: 18, fontWeight: '900' },
  summary: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
