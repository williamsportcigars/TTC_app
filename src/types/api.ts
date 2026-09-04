/**
 * Types mirroring the ttc-customer Worker's JSON contracts.
 *
 * `POST /verify-login` and `POST /customer-portal`'s exact shapes beyond
 * what Gray described are NOT yet confirmed (see the plan's "Backend
 * contract" section). Known fields are typed explicitly; anything else the
 * worker returns still comes through via the index signature so we never
 * silently drop real data, but we also don't invent fields the backend
 * hasn't confirmed it sends.
 */

export interface VerifyLoginRequest {
  phone: string;
  lastName: string;
}

/** The customer record returned alongside `valid: true`. */
export interface CustomerSession {
  name?: string;
  phone?: string;
  email?: string;
  // Purchase history, wishlist, and ratings are known to exist on the
  // backend (per Gray) but their exact field names on this response
  // aren't confirmed yet — they'll show up here once we type them.
  [key: string]: unknown;
}

export type VerifyLoginFailureReason = 'not found' | 'mismatch' | (string & {});

export type VerifyLoginResponse =
  | ({ valid: true } & CustomerSession)
  | { valid: false; reason: VerifyLoginFailureReason };
