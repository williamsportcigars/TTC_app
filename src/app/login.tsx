import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/auth/SessionContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/colors';

/** Same inline error copy as the myhumidor web portal. */
function errorMessageFor(reason: string): string {
  switch (reason) {
    case 'not found':
      return 'Number not found. Please visit us in store to register.';
    case 'mismatch':
      return 'Last name does not match our records.';
    case 'network':
      return 'Could not reach TTC. Check your connection and try again.';
    default:
      // ApiError messages are already written to be shown to the customer.
      return reason || 'Something went wrong. Please try again.';
  }
}

export default function LoginScreen() {
  const { login } = useSession();
  const theme = useTheme();

  const [phone, setPhone] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = phone.trim().length > 0 && lastName.trim().length > 0 && !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);
    const result = await login(phone.trim(), lastName.trim());
    setIsSubmitting(false);
    if (!result.ok) {
      setError(errorMessageFor(result.reason));
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.form}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="title" style={styles.title}>
              MyHumidor
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              The Tobacco Center — Williamsport, PA
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.fields}>
            <ThemedText type="smallBold" style={styles.label}>
              Phone number
            </ThemedText>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="(570) 555-0100"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              returnKeyType="next"
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            />

            <ThemedText type="smallBold" style={styles.label}>
              Last name
            </ThemedText>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Smith"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
              textContentType="familyName"
              autoComplete="name-family"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            />

            {error ? (
              <ThemedView style={[styles.errorBox, { borderColor: theme.danger }]}>
                <ThemedText style={{ color: theme.danger }}>{error}</ThemedText>
              </ThemedView>
            ) : null}

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.tint, opacity: !canSubmit ? 0.5 : pressed ? 0.85 : 1 },
              ]}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Enter My Vault</ThemedText>
              )}
            </Pressable>
          </ThemedView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    textAlign: 'center',
  },
  fields: {
    gap: Spacing.two,
  },
  label: {
    marginTop: Spacing.two,
  },
  input: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  button: {
    marginTop: Spacing.two,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
