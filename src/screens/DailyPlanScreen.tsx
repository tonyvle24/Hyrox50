import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DailyHeader } from '../components/DailyHeader';
import { DayNavigation } from '../components/DayNavigation';
import { DetailBlock } from '../components/DetailBlock';
import { Screen } from '../components/Screen';
import { trainingPlan } from '../plan/trainingPlan';
import type { DateKey } from '../plan/types';
import { colors, radius, spacing } from '../theme/tokens';
import { clampToPlanDate, getNextPlanDate, getPreviousPlanDate, toDateKey } from '../utils/dates';
import { readBrowserDay, writeBrowserDay } from '../utils/dayLinks';
import { AllDaysScreen } from './AllDaysScreen';

export const DailyPlanScreen = ({ initialDate }: { initialDate?: DateKey }) => {
  const [date, setDate] = useState<DateKey>(clampToPlanDate(initialDate ?? readBrowserDay() ?? toDateKey(new Date())));
  const [browsing, setBrowsing] = useState(false);
  useEffect(() => writeBrowserDay(date), [date]);
  const day = trainingPlan.find((candidate) => candidate.date === date) ?? trainingPlan[0]!;
  if (browsing) return <AllDaysScreen onSelect={(selected) => { setDate(selected); setBrowsing(false); }} onClose={() => setBrowsing(false)} />;
  return (
    <Screen>
      <DailyHeader day={day} />
      <DayNavigation onPrevious={() => setDate(getPreviousPlanDate(date))} onNext={() => setDate(getNextPlanDate(date))} onToday={() => setDate(clampToPlanDate(toDateKey(new Date())))} onBrowse={() => setBrowsing(true)} />
      <DetailBlock label="TOGETHER" plan={day.shared} accent={colors.lime} />
      <DetailBlock label="TONY" plan={day.tony} accent={colors.blue} />
      <DetailBlock label="LIZ" plan={day.liz} accent={colors.coral} />
      <View style={styles.notes}><Text style={styles.noteTitle}>COACHING NOTES</Text>{day.coachingNotes.map((note) => <Text key={note} style={styles.note}>- {note}</Text>)}</View>
      <DayNavigation onPrevious={() => setDate(getPreviousPlanDate(date))} onNext={() => setDate(getNextPlanDate(date))} onToday={() => setDate(clampToPlanDate(toDateKey(new Date())))} onBrowse={() => setBrowsing(true)} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  notes: { backgroundColor: colors.surfaceRaised, borderRadius: radius.md, gap: spacing.sm, padding: spacing.md },
  noteTitle: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  note: { color: colors.text, fontSize: 14, lineHeight: 20 },
});
