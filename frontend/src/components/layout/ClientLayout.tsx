'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { AppProvider } from '../../context/AppContext';
import { Toaster } from 'react-hot-toast';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <AppProvider>
        <main className="min-h-screen bg-white">
          {children}
        </main>
        <Toaster position="top-right" />
      </AppProvider>
    </AuthProvider>
  );
} 