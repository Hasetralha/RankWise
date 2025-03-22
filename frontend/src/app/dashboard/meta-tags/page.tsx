'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useApp } from '../../../context/AppContext';
import { toast } from 'react-hot-toast';

interface MetaTagForm {
  url: string;
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

const defaultFormData: MetaTagForm = {
  url: '',
  title: '',
  description: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: ''
};

export default function MetaTagsPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const { metaTags, addMetaTag, updateMetaTag, deleteMetaTag } = useApp();

  const [formData, setFormData] = useState<MetaTagForm>(defaultFormData);
  const [generatedTags, setGeneratedTags] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  // Load meta tag data if editing
  useEffect(() => {
    if (editId) {
      const metaTag = metaTags.find(tag => tag.id === editId);
      if (metaTag) {
        const formValues = {
          url: metaTag.url,
          title: metaTag.title,
          description: metaTag.description,
          keywords: metaTag.keywords || '',
          ogTitle: metaTag.ogTitle || '',
          ogDescription: metaTag.ogDescription || '',
          ogImage: metaTag.ogImage || '',
          twitterCard: metaTag.twitterCard || 'summary_large_image',
          twitterTitle: metaTag.twitterTitle || '',
          twitterDescription: metaTag.twitterDescription || '',
          twitterImage: metaTag.twitterImage || ''
        };
        setFormData(formValues);
        setIsEditing(true);
        
        // Generate the meta tags immediately
        const tags = [
          `<title>${formValues.title}</title>`,
          `<meta name="description" content="${formValues.description}" />`,
          formValues.keywords && `<meta name="keywords" content="${formValues.keywords}" />`,
          `<meta property="og:title" content="${formValues.ogTitle || formValues.title}" />`,
          `<meta property="og:description" content="${formValues.ogDescription || formValues.description}" />`,
          `<meta property="og:url" content="${formValues.url}" />`,
          formValues.ogImage && `<meta property="og:image" content="${formValues.ogImage}" />`,
          `<meta name="twitter:card" content="${formValues.twitterCard}" />`,
          `<meta name="twitter:title" content="${formValues.twitterTitle || formValues.ogTitle || formValues.title}" />`,
          `<meta name="twitter:description" content="${formValues.twitterDescription || formValues.ogDescription || formValues.description}" />`,
          formValues.twitterImage && `<meta name="twitter:image" content="${formValues.twitterImage || formValues.ogImage}" />`
        ].filter(Boolean).join('\n');
        
        setGeneratedTags(tags);
      }
    }
  }, [editId, metaTags]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateMetaTags = () => {
    const tags = [
      `<title>${formData.title}</title>`,
      `<meta name="description" content="${formData.description}" />`,
      formData.keywords && `<meta name="keywords" content="${formData.keywords}" />`,
      `<meta property="og:title" content="${formData.ogTitle || formData.title}" />`,
      `<meta property="og:description" content="${formData.ogDescription || formData.description}" />`,
      `<meta property="og:url" content="${formData.url}" />`,
      formData.ogImage && `<meta property="og:image" content="${formData.ogImage}" />`,
      `<meta name="twitter:card" content="${formData.twitterCard}" />`,
      `<meta name="twitter:title" content="${formData.twitterTitle || formData.ogTitle || formData.title}" />`,
      `<meta name="twitter:description" content="${formData.twitterDescription || formData.ogDescription || formData.description}" />`,
      formData.twitterImage && `<meta name="twitter:image" content="${formData.twitterImage || formData.ogImage}" />`
    ].filter(Boolean).join('\n');

    return tags;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const tags = generateMetaTags();
      setGeneratedTags(tags);

      const metaTagData = {
        id: editId || `meta_${Date.now()}`,
        ...formData,
        lastModified: new Date().toISOString(),
        createdAt: isEditing ? metaTags.find(tag => tag.id === editId)?.createdAt || new Date().toISOString() : new Date().toISOString()
      };

      if (isEditing) {
        updateMetaTag(editId!, metaTagData);
        toast.success('Meta tags updated successfully');
      } else {
        addMetaTag(metaTagData);
        toast.success('Meta tags generated successfully');
      }

      if (!isEditing) {
        setFormData(defaultFormData);
      }
    } catch (error) {
      toast.error('Failed to generate meta tags');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete these meta tags?')) {
      deleteMetaTag(id);
      toast.success('Meta tags deleted successfully');
      if (id === editId) {
        setFormData(defaultFormData);
        setIsEditing(false);
        setGeneratedTags('');
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedTags);
      toast.success('Meta tags copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy meta tags');
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meta Tags Generator</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Generate optimized meta tags for your web pages
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/dashboard/meta-tags');
                    setFormData(defaultFormData);
                    setIsEditing(false);
                    setGeneratedTags('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Meta Tags
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    Page URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    required
                    value={formData.url}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={60}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">{formData.title.length}/60 characters</p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={160}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">{formData.description.length}/160 characters</p>
                </div>

                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Open Graph Tags</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700">
                        OG Title (optional)
                      </label>
                      <input
                        type="text"
                        id="ogTitle"
                        name="ogTitle"
                        value={formData.ogTitle}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700">
                        OG Description (optional)
                      </label>
                      <textarea
                        id="ogDescription"
                        name="ogDescription"
                        value={formData.ogDescription}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700">
                        OG Image URL (optional)
                      </label>
                      <input
                        type="url"
                        id="ogImage"
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Twitter Card Tags</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="twitterCard" className="block text-sm font-medium text-gray-700">
                        Twitter Card Type
                      </label>
                      <select
                        id="twitterCard"
                        name="twitterCard"
                        value={formData.twitterCard}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary with Large Image</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="twitterTitle" className="block text-sm font-medium text-gray-700">
                        Twitter Title (optional)
                      </label>
                      <input
                        type="text"
                        id="twitterTitle"
                        name="twitterTitle"
                        value={formData.twitterTitle}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="twitterDescription" className="block text-sm font-medium text-gray-700">
                        Twitter Description (optional)
                      </label>
                      <textarea
                        id="twitterDescription"
                        name="twitterDescription"
                        value={formData.twitterDescription}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="twitterImage" className="block text-sm font-medium text-gray-700">
                        Twitter Image URL (optional)
                      </label>
                      <input
                        type="url"
                        id="twitterImage"
                        name="twitterImage"
                        value={formData.twitterImage}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(defaultFormData);
                        setIsEditing(false);
                        setGeneratedTags('');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      isEditing ? 'Update Meta Tags' : 'Generate Meta Tags'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview and History */}
            <div className="space-y-6">
              {/* Generated Tags Preview */}
              {generatedTags && (
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Generated Meta Tags</h2>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <pre className="mt-4 bg-gray-50 p-4 rounded-md overflow-auto text-sm text-gray-800">
                    {generatedTags}
                  </pre>
                </div>
              )}

              {/* History */}
              {showHistory && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">History</h2>
                  <div className="space-y-4">
                    {metaTags.length === 0 ? (
                      <p className="text-sm text-gray-500">No meta tags generated yet.</p>
                    ) : (
                      metaTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-900">{tag.title}</h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  window.history.pushState({}, '', `/dashboard/meta-tags?id=${tag.id}`);
                                  const metaTag = metaTags.find(t => t.id === tag.id);
                                  if (metaTag) {
                                    setFormData({
                                      url: metaTag.url,
                                      title: metaTag.title,
                                      description: metaTag.description,
                                      keywords: metaTag.keywords || '',
                                      ogTitle: metaTag.ogTitle || '',
                                      ogDescription: metaTag.ogDescription || '',
                                      ogImage: metaTag.ogImage || '',
                                      twitterCard: metaTag.twitterCard || 'summary_large_image',
                                      twitterTitle: metaTag.twitterTitle || '',
                                      twitterDescription: metaTag.twitterDescription || '',
                                      twitterImage: metaTag.twitterImage || ''
                                    });
                                    setIsEditing(true);
                                    setGeneratedTags(generateMetaTags());
                                  }
                                }}
                                className="inline-flex items-center px-2.5 py-1.5 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(tag.id)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{tag.url}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Last modified: {new Date(tag.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 