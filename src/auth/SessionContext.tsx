import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { verifyLogin } from '@/api/customer';
import { ApiError } from '@/api/client';
import type { CustomerSession, VerifyLoginFailureReason } from '@/types/api';
import { deleteSecureItem, getSecureItem, setSecureItem } from './secureStore';

const SESSION_STORAGE_KEY = 'ttc_myhumidor_session';

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: VerifyLoginFailureReason | 'network' };

interface SessionContextValue {
  /** The logged-in customer's data, or null when logged out. */
  session: CustomerSession | null;
  /** True only while the stored session is being read on app launch. */
  isLoading: boolean;
  login: (phone: string, lastName: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getSecureItem(SESSION_STORAGE_KEY);
      if (stored) {
        try {
          setSession(JSON.parse(stored) as CustomerSession);
        } catch (error) {
          console.warn('[SessionContext] Failed to parse stored session, clearing it', error);
          await deleteSecureItem(SESSION_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (phone: string, lastName: string): Promise<LoginResult> => {
    try {
      const result = await verifyLogin({ phone, lastName });
      if (!result.valid) {
        return { ok: false, reason: result.reason };
      }
      const { valid: _valid, ...customerData } = result;
      await setSecureItem(SESSION_STORAGE_KEY, JSON.stringify(customerData));
      setSession(customerData);
      return { ok: true };
    } catch (error) {
      console.warn('[SessionContext] login failed', error);
      return { ok: false, reason: error instanceof ApiError ? error.message : 'network' };
    }
  }, []);

  const logout = useCallback(async () => {
    await deleteSecureItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, login, logout }),
    [session, isLoading, login, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
