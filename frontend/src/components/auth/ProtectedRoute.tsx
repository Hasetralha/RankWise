'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // During development, always render children without authentication check
  return <>{children}</>;
} 