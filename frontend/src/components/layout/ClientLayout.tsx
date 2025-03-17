'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-white">
        {children}
      </main>
    </AuthProvider>
  );
} 