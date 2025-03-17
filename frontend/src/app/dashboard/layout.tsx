'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600">RankWise</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/meta-tags"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Meta Tags
            </Link>
            <Link
              href="/dashboard/content-analysis"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Content Analysis
            </Link>
            <Link
              href="/dashboard/sitemap"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Sitemap Generator
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 