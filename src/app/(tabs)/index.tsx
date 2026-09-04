import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/auth/SessionContext';
import { Spacing } from '@/theme/colors';

export default function VaultScreen() {
  const { session } = useSession();
  const insets = useSafeAreaInsets();
  const firstName = typeof session?.name === 'string' ? session.name.split(' ')[0] : undefined;

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.four }]}>
      <ThemedText type="title" style={styles.title}>
        {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
      </ThemedText>
      {session?.phone ? (
        <ThemedText themeColor="textSecondary">Logged in as {String(session.phone)}</ThemedText>
      ) : null}

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Your Vault is on its way</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.cardBody}>
          Recent purchases and blend specs will show up here next, pulled straight from your TTC
          purchase history.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  card: {
    marginTop: Spacing.four,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  cardBody: {
    lineHeight: 20,
  },
});
