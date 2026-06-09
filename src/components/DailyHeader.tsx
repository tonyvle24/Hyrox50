import { StyleSheet, Text, View } from 'react-native';

import type { DailyPlan } from '../plan/types';
import { daysBetween, formatUsDate } from '../utils/dates';
import { colors, radius, spacing } from '../theme/tokens';

export const DailyHeader = ({ day }: { day: DailyPlan }) => (
  <View style={styles.container}>
    <Text style={styles.brand}>HYROX50</Text>
    <Text style={styles.day}>Day {day.dayNumber} of 189</Text>
    <Text style={styles.date}>{formatUsDate(day.date)}</Text>
    <View style={styles.phase}><Text style={styles.phaseText}>{day.phase}</Text></View>
    <Text style={styles.title}>{day.title}</Text>
    <Text style={styles.purpose}>{day.purpose}</Text>
    <Text style={styles.meta}>{day.estimatedMinutes} minutes - {day.equipment.length ? day.equipment.join(' - ') : 'No equipment needed'}</Text>
    <View style={styles.countdowns}>
      <Text style={styles.countdown}>{day.date > '2026-11-18' ? 'HYROX complete' : `${daysBetween(day.date, '2026-11-18')} days to HYROX`}</Text>
      <Text style={styles.countdown}>{Math.max(0, daysBetween(day.date, '2026-12-13'))} days to the 50K</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  brand: { color: colors.lime, fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  day: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  date: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },
  phase: { alignSelf: 'flex-start', backgroundColor: colors.surfaceRaised, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  phaseText: { color: colors.gold, fontSize: 12, fontWeight: '900' },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -1.2, lineHeight: 36 },
  purpose: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  meta: { color: colors.text, fontSize: 12, fontWeight: '700', lineHeight: 18 },
  countdowns: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  countdown: { backgroundColor: colors.surface, borderRadius: radius.pill, color: colors.text, fontSize: 12, fontWeight: '800', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
});
