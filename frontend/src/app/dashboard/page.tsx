'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useApp } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { contentAnalyses, metaTags, sitemaps } = useApp();
  const { user } = useUser();

  // Calculate average SEO score from content analyses
  const averageScore = contentAnalyses.length
    ? Math.round(contentAnalyses.reduce((acc, curr) => acc + curr.score, 0) / contentAnalyses.length)
    : 0;

  // Prepare data for the SEO performance chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Group content analyses by date
  const scoresByDate = contentAnalyses.reduce((acc, analysis) => {
    const date = new Date(analysis.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(analysis.score);
    return acc;
  }, {} as Record<string, number[]>);

  const chartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'SEO Score',
        data: last7Days.map(date => {
          const scores = scoresByDate[date];
          return scores && scores.length > 0
            ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
            : null;
        }),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            if (value === null) return 'No data';
            return `Score: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        beginAtZero: true,
      },
    },
  };

  // Get recent activity
  const allActivities = [
    ...contentAnalyses.map(a => ({
      type: 'Content Analysis',
      url: a.url,
      score: a.score,
      date: new Date(a.lastModified),
    })),
    ...metaTags.map(m => ({
      type: 'Meta Tags',
      url: m.url,
      title: m.title,
      date: new Date(m.lastModified),
    })),
    ...sitemaps.map(s => ({
      type: 'Sitemap',
      url: s.websiteUrl,
      urls: s.totalUrls,
      date: new Date(s.lastGenerated),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // Calculate health scores
  const metaTagsScore = Math.min(100, (metaTags.length * 10));
  const contentScore = averageScore;
  const sitemapScore = Math.min(100, (sitemaps.length * 20));
  const overallHealth = Math.round((metaTagsScore + contentScore + sitemapScore) / 3);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Here's an overview of your SEO performance
                </p>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* SEO Performance Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Performance</h2>
              <div className="h-64">
                <Line options={chartOptions} data={chartData} />
              </div>
            </div>

            {/* SEO Health Score */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Health Score</h2>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-indigo-600"
                      strokeWidth="10"
                      strokeDasharray={350}
                      strokeDashoffset={350 - (350 * overallHealth) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-gray-900">
                    {overallHealth}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-gray-500">Meta Tags</div>
                  <div className="mt-1 text-xl font-semibold text-indigo-600">{metaTagsScore}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Content</div>
                  <div className="mt-1 text-xl font-semibold text-indigo-600">{contentScore}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Sitemap</div>
                  <div className="mt-1 text-xl font-semibold text-indigo-600">{sitemapScore}%</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {allActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      activity.type === 'Content Analysis' ? 'bg-green-500' :
                      activity.type === 'Meta Tags' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.url}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.date.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Insights */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Top Insights</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Meta Tags Optimization</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {metaTags.length === 0 ? 'Start adding meta tags to improve SEO' : `${metaTags.length} pages have meta tags`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Content Quality</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {contentAnalyses.length === 0 ? 'Analyze your content to get insights' : `Average score: ${averageScore}/100`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Sitemap Coverage</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {sitemaps.length === 0 ? 'Generate a sitemap to improve crawling' : `${sitemaps.reduce((acc, curr) => acc + curr.totalUrls, 0)} URLs mapped`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 