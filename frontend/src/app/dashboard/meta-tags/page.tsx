'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

interface MetaTagsForm {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export default function MetaTagsPage() {
  const [formData, setFormData] = useState<MetaTagsForm>({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  });

  const [preview, setPreview] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateMetaTags = () => {
    const metaTags = `<!-- Primary Meta Tags -->
<title>${formData.title}</title>
<meta name="title" content="${formData.title}">
<meta name="description" content="${formData.description}">
<meta name="keywords" content="${formData.keywords}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${formData.ogTitle || formData.title}">
<meta property="og:description" content="${formData.ogDescription || formData.description}">
<meta property="og:image" content="${formData.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="${formData.twitterCard}">
<meta property="twitter:title" content="${formData.twitterTitle || formData.ogTitle || formData.title}">
<meta property="twitter:description" content="${formData.twitterDescription || formData.ogDescription || formData.description}">
<meta property="twitter:image" content="${formData.twitterImage || formData.ogImage}">`;

    setPreview(metaTags);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Meta Tags Generator</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate optimized meta tags for your web pages.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Page Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your page title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your meta description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Keywords</label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter keywords, separated by commas"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Open Graph Tags</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">OG Title</label>
                      <input
                        type="text"
                        name="ogTitle"
                        value={formData.ogTitle}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Optional: Override page title for social media"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">OG Description</label>
                      <textarea
                        name="ogDescription"
                        value={formData.ogDescription}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Optional: Override description for social media"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">OG Image URL</label>
                      <input
                        type="url"
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter the URL of your social media image"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Twitter Card Tags</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Type</label>
                      <select
                        name="twitterCard"
                        value={formData.twitterCard}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary with Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={generateMetaTags}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Generate Meta Tags
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              {preview ? (
                <div className="relative">
                  <pre className="bg-gray-50 rounded-md p-4 overflow-x-auto text-sm text-gray-800">
                    {preview}
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-md shadow-sm"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Fill out the form and click "Generate Meta Tags" to see the preview here.
                </p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 