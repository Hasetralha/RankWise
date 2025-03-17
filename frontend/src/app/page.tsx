'use client';

import React from 'react';
import Link from 'next/link';

const features = [
  {
    title: 'Meta Tag Generator',
    description: 'Create optimized meta tags for your web pages with just a few clicks.',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    title: 'Content Analysis',
    description: 'Get instant feedback on your content\'s SEO performance and readability.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'Sitemap Generator',
    description: 'Automatically generate and update your sitemap for better search engine visibility.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    title: 'Keyword Research',
    description: 'Find the perfect keywords to target with our advanced research tools.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    title: 'Performance Tracking',
    description: 'Monitor your SEO progress with detailed analytics and reports.',
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Creator',
    content: 'RankWise has completely transformed how I optimize my content. The meta tag generator alone has saved me hours of work!',
    avatar: '👩‍💼',
  },
  {
    name: 'Mike Chen',
    role: 'Digital Marketer',
    content: 'The content analysis tool provides insights that have helped me improve my search rankings significantly.',
    avatar: '👨‍💼',
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">RankWise</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="pt-24 pb-8 sm:pt-32 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Optimize Your SEO
              <span className="text-indigo-600"> in Minutes</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The all-in-one SEO toolkit that helps content creators and small businesses improve their search engine visibility.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Start Optimizing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to rank better
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful tools to optimize your content and improve your search engine rankings.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="inline-flex p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-500">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-8 h-full flex flex-col">
                <div>
                  <h3 className="text-center text-2xl font-bold text-gray-900">Monthly Plan</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="px-3 py-1 text-sm text-indigo-600 bg-indigo-50 rounded-full">
                      Most Flexible
                    </span>
                  </div>
                  <p className="mt-4 text-center text-5xl font-extrabold text-gray-900">
                    $9.99
                    <span className="text-xl font-medium text-gray-500"> USD/month</span>
                  </p>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Perfect for ongoing SEO optimization
                  </p>

                  <ul className="mt-8 space-y-4">
                    {[
                      'Unlimited Meta Tag Generation',
                      'Content Analysis',
                      'Sitemap Generator',
                      'SEO Performance Tracking',
                      'Priority Support',
                      'Cancel Anytime',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 mt-auto">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Start Monthly Plan
                  </Link>
                </div>
              </div>
            </div>

            {/* Lifetime Plan */}
            <div className="bg-white shadow-lg rounded-lg border-2 border-indigo-500">
              <div className="px-6 py-8 h-full flex flex-col">
                <div>
                  <h3 className="text-center text-2xl font-bold text-gray-900">Lifetime Access</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="px-3 py-1 text-sm text-indigo-600 bg-indigo-50 rounded-full">
                      Best Value
                    </span>
                  </div>
                  <p className="mt-4 text-center text-5xl font-extrabold text-gray-900">
                    $49.99
                    <span className="text-xl font-medium text-gray-500"> USD</span>
                  </p>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    One-time payment, lifetime access
                  </p>

                  <ul className="mt-8 space-y-4">
                    {[
                      'Everything in Monthly Plan',
                      'Lifetime Updates',
                      'Advanced AI Features',
                      'Custom Branding Options',
                      'API Access',
                      'Premium Support',
                      'Team Collaboration Tools',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 mt-auto">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Get Lifetime Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose RankWise?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Simple and effective SEO tools for your website
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[
              {
                title: 'Easy to Use',
                description: 'No technical knowledge required. Our intuitive interface makes SEO accessible to everyone.',
                icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
              },
              {
                title: 'Instant Results',
                description: 'See improvements in your search rankings within days, not months.',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="mt-2 text-base text-gray-500 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-gray-900">RankWise</h2>
              <p className="ml-3 text-gray-500 text-sm">© 2025 All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 