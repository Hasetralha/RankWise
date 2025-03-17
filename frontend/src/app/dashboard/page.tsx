'use client';

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Link from 'next/link';

const stats = [
  { name: 'Meta Tags Generated', value: '0' },
  { name: 'Pages Analyzed', value: '0' },
  { name: 'SEO Score', value: 'N/A' },
  { name: 'Keywords Tracked', value: '0' },
];

const recentActivity = [
  {
    id: 1,
    type: 'Meta Tags',
    description: 'Welcome to your dashboard! Start by generating meta tags for your pages.',
    date: new Date().toLocaleDateString(),
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome to RankWise. Get started with our SEO tools below.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-5 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Meta Tag Generator</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create optimized meta tags for your web pages.
              </p>
              <Link href="/dashboard/meta-tags" className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Generate Tags
              </Link>
            </div>
            <div className="p-5 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Content Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">
                Analyze your content for SEO optimization.
              </p>
              <Link href="/dashboard/content" className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Analyze Content
              </Link>
            </div>
            <div className="p-5 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Sitemap Generator</h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate a sitemap for your website.
              </p>
              <Link href="/dashboard/sitemap" className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Generate Sitemap
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-4 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.type}
                          </p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">{activity.date}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 