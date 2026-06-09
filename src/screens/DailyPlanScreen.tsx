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

const isRunActivity = (name: string, prescription: string): boolean =>
  /\brun\b|\brunning\b|\brun\/walk\b|\bjog\b|\bjogging\b|zone 2|50K/i.test(`${name} ${prescription}`);

export const DailyPlanScreen = ({ initialDate }: { initialDate?: DateKey }) => {
  const [date, setDate] = useState<DateKey>(clampToPlanDate(initialDate ?? readBrowserDay() ?? toDateKey(new Date())));
  const [browsing, setBrowsing] = useState(false);
  useEffect(() => writeBrowserDay(date), [date]);
  const day = trainingPlan.find((candidate) => candidate.date === date) ?? trainingPlan[0]!;
  const splitRuns = JSON.stringify(day.tony) !== JSON.stringify(day.liz);
  const combinedMain = day.tony.main.filter((detail) => !isRunActivity(detail.name, detail.prescription));
  const tonyRuns = day.tony.main.filter((detail) => isRunActivity(detail.name, detail.prescription));
  const lizRuns = day.liz.main.filter((detail) => isRunActivity(detail.name, detail.prescription));
  const combinedPlan = splitRuns ? { ...day.tony, summary: 'Complete this workout together.', main: combinedMain } : day.tony;
  const tonyRunPlan = { ...day.tony, summary: 'Tony running prescription.', main: tonyRuns };
  const lizRunPlan = { ...day.liz, summary: 'Liz HYROX-focused running prescription.', main: lizRuns.length ? lizRuns : day.liz.main };
  if (browsing) return <AllDaysScreen onSelect={(selected) => { setDate(selected); setBrowsing(false); }} onClose={() => setBrowsing(false)} />;
  return (
    <Screen>
      <DailyHeader day={day} />
      <DayNavigation onPrevious={() => setDate(getPreviousPlanDate(date))} onNext={() => setDate(getNextPlanDate(date))} onToday={() => setDate(clampToPlanDate(toDateKey(new Date())))} onBrowse={() => setBrowsing(true)} />
      <DetailBlock label="TOGETHER" plan={day.shared} accent={colors.lime} />
      {combinedPlan.main.length ? <DetailBlock label="WORKOUT" plan={combinedPlan} accent={colors.blue} /> : null}
      {splitRuns ? <DetailBlock label="TONY RUN" plan={tonyRunPlan} accent={colors.blue} /> : null}
      {splitRuns ? <DetailBlock label="LIZ HYROX RUN" plan={lizRunPlan} accent={colors.coral} /> : null}
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
