import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
}

/** Honest placeholder for a tab whose backend data contract isn't wired up yet. */
export function ComingSoonNotice({ icon, title, message }: Props) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Ionicons name={icon} size={40} color={theme.tint} style={styles.icon} />
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  icon: {
    marginBottom: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});
