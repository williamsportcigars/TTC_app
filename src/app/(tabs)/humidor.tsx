import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/colors';

const VIRTUAL_HUMIDOR_URL = 'https://www.thetobaccocenter.com/virtual_humidor';

export default function HumidorScreen() {
  const theme = useTheme();
  // react-native-webview's WebView is `class WebView<P = undefined>`; without
  // an explicit type argument here and on the JSX element below, TS infers
  // P as `undefined` and the props type collapses to `never`.
  const webViewRef = useRef<WebView<object>>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function retry() {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  }

  // Keep customers inside the humidor page itself — if it links out to an
  // unrelated site, that's outside what this tab is for.
  function handleShouldStartLoad(request: WebViewNavigation) {
    return request.url.includes('thetobaccocenter.com');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {hasError ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText type="subtitle" style={styles.centerText}>
            Couldn't load the humidor
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.centerText}>
            Check your connection and try again.
          </ThemedText>
          <Pressable
            onPress={retry}
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 },
            ]}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </Pressable>
        </ThemedView>
      ) : (
        <>
          <WebView<object>
            ref={webViewRef}
            source={{ uri: VIRTUAL_HUMIDOR_URL }}
            style={styles.webView}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => setHasError(true)}
            onHttpError={() => setHasError(true)}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
          />
          {isLoading ? (
            <ThemedView style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
              <ActivityIndicator size="large" color={theme.tint} />
            </ThemedView>
          ) : null}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  centerText: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.two,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
