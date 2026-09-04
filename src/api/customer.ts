import { postJson } from './client';
import type { VerifyLoginRequest, VerifyLoginResponse } from '@/types/api';

/**
 * Calls the existing, live `/verify-login` endpoint. No email, no OTP —
 * just phone number + last name, matched against the KV record created
 * when a customer registers in-store.
 */
export function verifyLogin(payload: VerifyLoginRequest): Promise<VerifyLoginResponse> {
  return postJson<VerifyLoginResponse>('/verify-login', payload);
}

// Purchase history / wishlist / ratings calls against `/customer-portal`
// land here once the exact request/response contract is confirmed with
// Gray (see the plan's open questions) — intentionally not guessed at yet.
