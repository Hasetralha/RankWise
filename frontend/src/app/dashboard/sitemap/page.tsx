'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useApp } from '../../../context/AppContext';
import { toast } from 'react-hot-toast';

interface SitemapForm {
  websiteUrl: string;
  changeFrequency: string;
  priority: string;
  excludePatterns: string[];
  includeImages: boolean;
  maxUrls: number;
  lastModified: boolean;
  crawlSinglePage: boolean;
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
  images?: { loc: string; title?: string }[];
}

const defaultFormData: SitemapForm = {
  websiteUrl: '',
  changeFrequency: 'weekly',
  priority: '0.8',
  excludePatterns: [],
  includeImages: true,
  maxUrls: 1000,
  lastModified: true,
  crawlSinglePage: false,
};

export default function SitemapPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const { sitemaps, addSitemap, updateSitemap, deleteSitemap } = useApp();

  const [formData, setFormData] = useState<SitemapForm>(defaultFormData);
  const [generatedSitemap, setGeneratedSitemap] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [crawlingStatus, setCrawlingStatus] = useState<{
    inProgress: boolean;
    urlsCrawled: number;
    currentUrl: string;
  }>({
    inProgress: false,
    urlsCrawled: 0,
    currentUrl: '',
  });

  // Load sitemap data if editing
  useEffect(() => {
    if (editId) {
      const sitemap = sitemaps.find(s => s.id === editId);
      if (sitemap) {
        setFormData({
          websiteUrl: sitemap.websiteUrl,
          changeFrequency: sitemap.settings.changeFrequency,
          priority: sitemap.settings.priority,
          excludePatterns: [],
          includeImages: sitemap.settings.includeImages,
          maxUrls: 1000,
          lastModified: true,
          crawlSinglePage: false,
        });
        setIsEditing(true);
        // Set the generated sitemap XML if it exists
        if (sitemap.generatedXml) {
          setGeneratedSitemap(sitemap.generatedXml);
        }
      }
    }
  }, [editId, sitemaps]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'excludePatterns') {
      setFormData(prev => ({
        ...prev,
        excludePatterns: value.split('\n').map(p => p.trim()).filter(p => p),
      }));
    } else if (name === 'maxUrls') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const mockCrawl = async (url: string): Promise<SitemapUrl[]> => {
    // Simulate crawling delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock URLs based on the input URL
    const baseUrl = new URL(url);
    const mockUrls: SitemapUrl[] = [
      {
        loc: baseUrl.href,
        lastmod: new Date().toISOString(),
        changefreq: formData.changeFrequency,
        priority: formData.priority,
        images: formData.includeImages ? [
          { loc: `${baseUrl.href}images/hero.jpg`, title: 'Hero Image' },
          { loc: `${baseUrl.href}images/feature.jpg`, title: 'Feature Image' },
        ] : undefined,
      },
    ];

    // Add some mock internal pages
    const paths = ['about', 'contact', 'services', 'blog', 'products'];
    paths.forEach(path => {
      if (mockUrls.length < formData.maxUrls) {
        mockUrls.push({
          loc: `${baseUrl.href}${path}`,
          lastmod: new Date().toISOString(),
          changefreq: formData.changeFrequency,
          priority: Math.max(0.1, Number(formData.priority) - 0.2).toFixed(1),
          images: formData.includeImages ? [
            { loc: `${baseUrl.href}images/${path}.jpg`, title: `${path} Image` },
          ] : undefined,
        });
      }
    });

    return mockUrls;
  };

  const generateSitemapXml = (urls: SitemapUrl[]): string => {
    const xmlUrls = urls.map(url => {
      const images = url.images?.map(img => 
        `    <image:image>
      <image:loc>${img.loc}</image:loc>
      ${img.title ? `      <image:title>${img.title}</image:title>` : ''}
    </image:image>`
      ).join('\n') || '';

      return `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod && formData.lastModified ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${images ? images + '\n' : ''}  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlUrls}
</urlset>`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCrawlingStatus({
      inProgress: true,
      urlsCrawled: 0,
      currentUrl: formData.websiteUrl,
    });

    try {
      const urls = await mockCrawl(formData.websiteUrl);
      const sitemap = generateSitemapXml(urls);
      setGeneratedSitemap(sitemap);

      const sitemapData = {
        id: editId || `sitemap_${Date.now()}`,
        websiteUrl: formData.websiteUrl,
        totalUrls: urls.length,
        lastGenerated: new Date().toISOString(),
        settings: {
          changeFrequency: formData.changeFrequency,
          priority: formData.priority,
          includeImages: formData.includeImages,
        },
        generatedXml: sitemap,
      };

      if (isEditing) {
        updateSitemap(editId!, sitemapData);
        toast.success('Sitemap updated successfully');
      } else {
        addSitemap(sitemapData);
        toast.success('Sitemap generated successfully');
      }

      if (!isEditing) {
        setFormData(defaultFormData);
      }
    } catch (error) {
      toast.error('Failed to generate sitemap');
    } finally {
      setIsGenerating(false);
      setCrawlingStatus({
        inProgress: false,
        urlsCrawled: 0,
        currentUrl: '',
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sitemap?')) {
      deleteSitemap(id);
      toast.success('Sitemap deleted successfully');
      if (id === editId) {
        setFormData(defaultFormData);
        setIsEditing(false);
        setGeneratedSitemap('');
      }
    }
  };

  const handleDownload = () => {
    if (!generatedSitemap) return;

    const blob = new Blob([generatedSitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sitemap Generator</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Generate XML sitemaps for your website.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/dashboard/sitemap');
                    setFormData(defaultFormData);
                    setIsEditing(false);
                    setGeneratedSitemap('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Sitemap
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
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    required
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="changeFrequency" className="block text-sm font-medium text-gray-700">
                    Change Frequency
                  </label>
                  <select
                    id="changeFrequency"
                    name="changeFrequency"
                    value={formData.changeFrequency}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="1.0">1.0</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8</option>
                    <option value="0.7">0.7</option>
                    <option value="0.6">0.6</option>
                    <option value="0.5">0.5</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="excludePatterns" className="block text-sm font-medium text-gray-700">
                    Exclude Patterns (one per line)
                  </label>
                  <textarea
                    id="excludePatterns"
                    name="excludePatterns"
                    rows={3}
                    value={formData.excludePatterns.join('\n')}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="/admin/*&#10;/private/*&#10;*.pdf"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeImages"
                      name="includeImages"
                      checked={formData.includeImages}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeImages" className="ml-2 block text-sm text-gray-700">
                      Include image sitemap
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="lastModified"
                      name="lastModified"
                      checked={formData.lastModified}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="lastModified" className="ml-2 block text-sm text-gray-700">
                      Include last modified dates
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="crawlSinglePage"
                      name="crawlSinglePage"
                      checked={formData.crawlSinglePage}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="crawlSinglePage" className="ml-2 block text-sm text-gray-700">
                      Generate for single page only
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(defaultFormData);
                        setIsEditing(false);
                        setGeneratedSitemap('');
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
                      isEditing ? 'Update Sitemap' : 'Generate Sitemap'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Results and History */}
            <div className="space-y-6">
              {/* Generated Sitemap */}
              {generatedSitemap && (
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Generated Sitemap</h2>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download XML
                    </button>
                  </div>
                  <pre className="mt-4 bg-gray-50 p-4 rounded-md overflow-auto text-sm text-gray-800">
                    {generatedSitemap}
                  </pre>
                </div>
              )}

              {/* History */}
              {showHistory && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">History</h2>
                  <div className="space-y-4">
                    {sitemaps.length === 0 ? (
                      <p className="text-sm text-gray-500">No sitemaps generated yet.</p>
                    ) : (
                      sitemaps.map((sitemap) => (
                        <div
                          key={sitemap.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                Sitemap for {sitemap.websiteUrl}
                              </h3>
                              <p className="text-sm text-gray-500">
                                URLs: {sitemap.totalUrls}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  window.history.pushState({}, '', `/dashboard/sitemap?id=${sitemap.id}`);
                                  const existingSitemap = sitemaps.find(s => s.id === sitemap.id);
                                  if (existingSitemap) {
                                    setFormData({
                                      websiteUrl: existingSitemap.websiteUrl,
                                      changeFrequency: existingSitemap.settings.changeFrequency,
                                      priority: existingSitemap.settings.priority,
                                      excludePatterns: [],
                                      includeImages: existingSitemap.settings.includeImages,
                                      maxUrls: 1000,
                                      lastModified: true,
                                      crawlSinglePage: false,
                                    });
                                    setIsEditing(true);
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
                                onClick={() => handleDelete(sitemap.id)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">
                            Last generated: {new Date(sitemap.lastGenerated).toLocaleDateString()}
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