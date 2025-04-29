import type React from 'react';

/**
 * Layout for authentication pages (Login, Signup).
 * Provides a common structure if needed in the future, currently just passes children.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
