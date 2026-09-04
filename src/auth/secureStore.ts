import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Thin wrapper around expo-secure-store (iOS Keychain / Android Keystore).
 *
 * expo-secure-store doesn't support web, and any read/write can in theory
 * throw on-device (corrupted keychain entry, storage full, etc.). Since
 * this holds a customer's phone number and purchase history, we never want
 * a storage hiccup to crash the app — we fall back to an in-memory store
 * instead, which just means the customer has to log in again this session.
 */

const memoryFallback = new Map<string, string>();
const isSecureStoreAvailable = Platform.OS !== 'web';

export async function getSecureItem(key: string): Promise<string | null> {
  if (!isSecureStoreAvailable) return memoryFallback.get(key) ?? null;
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`[secureStore] getItem("${key}") failed, falling back to memory`, error);
    return memoryFallback.get(key) ?? null;
  }
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  if (!isSecureStoreAvailable) {
    memoryFallback.set(key, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn(`[secureStore] setItem("${key}") failed, falling back to memory`, error);
    memoryFallback.set(key, value);
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  memoryFallback.delete(key);
  if (!isSecureStoreAvailable) return;
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`[secureStore] deleteItem("${key}") failed`, error);
  }
}
