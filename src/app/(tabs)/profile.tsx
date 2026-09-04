import { Alert, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/auth/SessionContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/colors';

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView style={styles.row}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText>{value}</ThemedText>
    </ThemedView>
  );
}

export default function ProfileScreen() {
  const { session, logout } = useSession();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  function confirmLogout() {
    Alert.alert('Log out?', "You'll need your phone number and last name to log back in.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.four }]}>
      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.card}>
        <ProfileRow label="Name" value={typeof session?.name === 'string' ? session.name : '—'} />
        <ProfileRow label="Phone on file" value={typeof session?.phone === 'string' ? session.phone : '—'} />
      </ThemedView>

      <ExternalLink href="https://thetobaccocenter.com" style={styles.link}>
        <ThemedText type="linkPrimary">Visit thetobaccocenter.com</ThemedText>
      </ExternalLink>

      <Pressable
        onPress={confirmLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          { borderColor: theme.danger, opacity: pressed ? 0.7 : 1 },
        ]}>
        <ThemedText style={{ color: theme.danger, fontWeight: '600' }}>Log Out</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  row: {
    gap: Spacing.half,
  },
  link: {
    alignSelf: 'flex-start',
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: Spacing.five,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
