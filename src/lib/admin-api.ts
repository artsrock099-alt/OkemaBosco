import { NextResponse } from 'next/server';
import { auth } from './auth';
import { ALL_ADMIN_ROLES } from './rbac';

export type AdminSession = {
  user: { id: string; role: string; email?: string | null };
};

/**
 * Guards an admin API route. Returns { error, session } — if error is set,
 * respond with it immediately.
 */
export async function requireAdmin(): Promise<
  { error: NextResponse; session: null } | { error: null; session: AdminSession }
> {
  const session = await auth();
  if (!session || !ALL_ADMIN_ROLES.includes(session.user.role)) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }), session: null };
  }
  return {
    error: null,
    session: { user: { id: session.user.id, role: session.user.role, email: session.user.email } },
  };
}

export function handleApiError(error: unknown, message = 'Something went wrong') {
  console.error(message, error);
  return NextResponse.json({ message }, { status: 500 });
}
