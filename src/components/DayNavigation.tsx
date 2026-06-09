import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

const Button = ({ label, onPress, primary = false }: { label: string; onPress: () => void; primary?: boolean }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.button, primary && styles.primary]}>
    <Text style={[styles.buttonText, primary && styles.primaryText]}>{label}</Text>
  </Pressable>
);

export const DayNavigation = ({ onPrevious, onNext, onToday, onBrowse }: { onPrevious: () => void; onNext: () => void; onToday: () => void; onBrowse: () => void }) => (
  <View style={styles.wrap}>
    <View style={styles.row}><Button label="Previous Day" onPress={onPrevious} /><Button label="Next Day" onPress={onNext} /></View>
    <View style={styles.row}><Button label="Jump to Today" onPress={onToday} primary /><Button label="Browse All Days" onPress={onBrowse} /></View>
  </View>
);

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  button: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 50, padding: spacing.sm },
  primary: { backgroundColor: colors.lime, borderColor: colors.lime },
  buttonText: { color: colors.text, fontSize: 13, fontWeight: '900', textAlign: 'center' },
  primaryText: { color: colors.background },
});
