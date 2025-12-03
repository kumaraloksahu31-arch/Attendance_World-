
'use client';

import { UserProvider } from '@/firebase/auth/use-user';

// This file is now a wrapper around the new UserProvider.
// It maintains the previous file structure to avoid breaking imports
// in components that haven't been migrated yet.
// All logic is now in `src/firebase/auth/use-user.tsx`.

export const AuthProvider = UserProvider;
