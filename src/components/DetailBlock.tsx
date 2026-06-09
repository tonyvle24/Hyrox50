import { StyleSheet, Text, View } from 'react-native';

import type { ActivityDetail, AthletePlan } from '../plan/types';
import { colors, radius, spacing } from '../theme/tokens';

const Activity = ({ activity }: { activity: ActivityDetail }) => (
  <View style={styles.activity}>
    <Text style={styles.activityName}>{activity.name}</Text>
    <Text style={styles.prescription}>{activity.prescription}</Text>
    <Text style={styles.meta}>{activity.targetRpe}</Text>
    <Text style={styles.meta}>Rest: {activity.rest}</Text>
    <Text style={styles.cue}>Cue: {activity.coachingCue}</Text>
  </View>
);

export const DetailBlock = ({ label, plan, accent }: { label: string; plan: AthletePlan; accent: string }) => (
  <View style={[styles.block, { borderTopColor: accent }]}>
    <Text style={[styles.label, { color: accent }]}>{label}</Text>
    <Text style={styles.summary}>{plan.summary}</Text>
    <Text style={styles.section}>WARMUP</Text>
    {plan.warmup.map((item, index) => <Activity key={`warmup-${index}-${item.name}`} activity={item} />)}
    <Text style={styles.section}>MAIN WORK</Text>
    {plan.main.map((item, index) => <Activity key={`main-${index}-${item.name}`} activity={item} />)}
    <Text style={styles.section}>COOLDOWN</Text>
    {plan.cooldown.map((item, index) => <Activity key={`cool-${index}-${item.name}`} activity={item} />)}
  </View>
);

const styles = StyleSheet.create({
  block: { backgroundColor: colors.surface, borderRadius: radius.lg, borderTopWidth: 4, gap: spacing.md, padding: spacing.md },
  label: { fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
  summary: { color: colors.text, fontSize: 17, fontWeight: '800', lineHeight: 23 },
  section: { color: colors.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginTop: spacing.xs },
  activity: { borderTopColor: colors.border, borderTopWidth: 1, gap: 5, paddingTop: spacing.sm },
  activityName: { color: colors.text, fontSize: 17, fontWeight: '900' },
  prescription: { color: colors.text, fontSize: 15, lineHeight: 22 },
  meta: { color: colors.gold, fontSize: 13, fontWeight: '800', lineHeight: 18 },
  cue: { color: colors.muted, fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
});
