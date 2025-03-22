'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useApp } from '../../../context/AppContext';
import { toast } from 'react-hot-toast';

interface ContentAnalysisForm {
  url: string;
  keywords: string[];
  minWordCount?: number;
  checkReadability?: boolean;
  checkLinks?: boolean;
  checkImages?: boolean;
}

interface ContentMetrics {
  wordCount: number;
  readingTime: number;
  readabilityScore: number;
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
  };
  paragraphCount: number;
  averageParagraphLength: number;
  linksCount: {
    internal: number;
    external: number;
  };
  imagesCount: number;
  imagesWithAlt: number;
}

const defaultFormData: ContentAnalysisForm = {
  url: '',
  keywords: [],
  minWordCount: 300,
  checkReadability: true,
  checkLinks: true,
  checkImages: true,
};

export default function ContentAnalysisPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const { contentAnalyses, addContentAnalysis, updateContentAnalysis, deleteContentAnalysis } = useApp();

  const [formData, setFormData] = useState<ContentAnalysisForm>(defaultFormData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContentMetrics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  // Load content analysis data if editing
  useEffect(() => {
    if (editId) {
      const analysis = contentAnalyses.find(a => a.id === editId);
      if (analysis) {
        setFormData({
          url: analysis.url,
          keywords: Object.keys(analysis.keywordDensity),
          minWordCount: 300,
          checkReadability: true,
          checkLinks: true,
          checkImages: true,
        });
        setIsEditing(true);
        // Set the analysis result from stored metrics
        if (analysis.metrics) {
          setAnalysisResult(analysis.metrics);
        }
      }
    }
  }, [editId, contentAnalyses]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'keywords') {
      setFormData(prev => ({
        ...prev,
        keywords: value.split(',').map(k => k.trim()).filter(k => k),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const mockAnalysis = async (url: string, keywords: string[]): Promise<ContentMetrics> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      wordCount: Math.floor(Math.random() * 1000) + 500,
      readingTime: Math.floor(Math.random() * 5) + 2,
      readabilityScore: Math.floor(Math.random() * 30) + 70,
      headingStructure: {
        h1: 1,
        h2: Math.floor(Math.random() * 3) + 2,
        h3: Math.floor(Math.random() * 5) + 3,
        h4: Math.floor(Math.random() * 3) + 1,
      },
      paragraphCount: Math.floor(Math.random() * 15) + 10,
      averageParagraphLength: Math.floor(Math.random() * 50) + 30,
      linksCount: {
        internal: Math.floor(Math.random() * 8) + 3,
        external: Math.floor(Math.random() * 5) + 1,
      },
      imagesCount: Math.floor(Math.random() * 6) + 2,
      imagesWithAlt: Math.floor(Math.random() * 4) + 1,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const metrics = await mockAnalysis(formData.url, formData.keywords);
      setAnalysisResult(metrics);

      const analysisData = {
        id: editId || `analysis_${Date.now()}`,
        url: formData.url,
        score: metrics.readabilityScore,
        suggestions: [
          'Add more relevant keywords in the title tag',
          'Increase keyword density in the first paragraph',
          'Add more internal links to related content',
        ],
        keywordDensity: formData.keywords.reduce((acc, keyword) => ({
          ...acc,
          [keyword]: Number((Math.random() * 3 + 0.5).toFixed(2)),
        }), {}),
        metrics: metrics,
        createdAt: isEditing ? contentAnalyses.find(a => a.id === editId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      if (isEditing) {
        updateContentAnalysis(editId!, analysisData);
        toast.success('Content analysis updated successfully');
      } else {
        addContentAnalysis(analysisData);
        toast.success('Content analysis completed successfully');
      }

      if (!isEditing) {
        setFormData(defaultFormData);
      }
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteContentAnalysis(id);
      toast.success('Content analysis deleted successfully');
      if (id === editId) {
        setFormData(defaultFormData);
        setIsEditing(false);
        setAnalysisResult(null);
      }
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Analysis</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Analyze your website content for SEO optimization and get actionable suggestions.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/dashboard/content-analysis');
                    setFormData(defaultFormData);
                    setIsEditing(false);
                    setAnalysisResult(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Analysis
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
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    required
                    value={formData.keywords.join(', ')}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="checkReadability"
                      name="checkReadability"
                      checked={formData.checkReadability}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="checkReadability" className="ml-2 block text-sm text-gray-700">
                      Check readability
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="checkLinks"
                      name="checkLinks"
                      checked={formData.checkLinks}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="checkLinks" className="ml-2 block text-sm text-gray-700">
                      Check links
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="checkImages"
                      name="checkImages"
                      checked={formData.checkImages}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="checkImages" className="ml-2 block text-sm text-gray-700">
                      Check images
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
                        setAnalysisResult(null);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      isEditing ? 'Update Analysis' : 'Start Analysis'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Results and History */}
            <div className="space-y-6">
              {/* Analysis Results */}
              {analysisResult && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
                  <div className="space-y-6">
                    {/* Content Overview */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Content Overview</h3>
                      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="bg-gray-50 px-4 py-5 rounded-lg">
                          <dt className="text-sm font-medium text-gray-500">Word Count</dt>
                          <dd className="mt-1 flex justify-between items-center">
                            <div className="text-2xl font-semibold text-gray-900">{analysisResult.wordCount}</div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              analysisResult.wordCount >= 300 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {analysisResult.wordCount >= 300 ? 'Good' : 'Too Short'}
                            </span>
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 rounded-lg">
                          <dt className="text-sm font-medium text-gray-500">Reading Time</dt>
                          <dd className="mt-1 flex justify-between items-center">
                            <div className="text-2xl font-semibold text-gray-900">{analysisResult.readingTime} min</div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {analysisResult.readingTime <= 7 ? 'Quick Read' : 'Long Form'}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Readability */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Readability</h3>
                      <div className="bg-gray-50 px-4 py-5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-500">Readability Score</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analysisResult.readabilityScore >= 80 ? 'bg-green-100 text-green-800' :
                            analysisResult.readabilityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analysisResult.readabilityScore >= 80 ? 'Easy to Read' :
                             analysisResult.readabilityScore >= 60 ? 'Moderate' :
                             'Difficult'}
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${analysisResult.readabilityScore}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                analysisResult.readabilityScore >= 80 ? 'bg-green-500' :
                                analysisResult.readabilityScore >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                            />
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold inline-block text-gray-800">
                              {analysisResult.readabilityScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Structure Analysis */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Content Structure</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="bg-gray-50 px-4 py-5 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Heading Distribution</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">H1</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                analysisResult.headingStructure.h1 === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {analysisResult.headingStructure.h1}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">H2</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysisResult.headingStructure.h2}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">H3</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysisResult.headingStructure.h3}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">H4</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysisResult.headingStructure.h4}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Paragraph Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total Paragraphs</span>
                              <span className="text-sm font-medium text-gray-900">{analysisResult.paragraphCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Avg. Length</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                analysisResult.averageParagraphLength <= 150 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {analysisResult.averageParagraphLength} words
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Links and Images */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Links and Media</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="bg-gray-50 px-4 py-5 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Links</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Internal Links</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysisResult.linksCount.internal}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">External Links</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {analysisResult.linksCount.external}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Images</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total Images</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysisResult.imagesCount}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">With Alt Text</span>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  analysisResult.imagesWithAlt === analysisResult.imagesCount ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {analysisResult.imagesWithAlt}/{analysisResult.imagesCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              {showHistory && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis History</h3>
                  <div className="space-y-6">
                    {contentAnalyses.map((analysis) => (
                      <div key={analysis.id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{analysis.url}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Content Overview</h5>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-600">
                                    Words: {analysis.metrics.wordCount}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Reading Time: {analysis.metrics.readingTime} min
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Readability Score: {analysis.metrics.readabilityScore}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Structure</h5>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-600">
                                    Headings: H1 ({analysis.metrics.headingStructure.h1}), 
                                    H2 ({analysis.metrics.headingStructure.h2}), 
                                    H3 ({analysis.metrics.headingStructure.h3})
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Paragraphs: {analysis.metrics.paragraphCount}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Links: {analysis.metrics.linksCount.internal + analysis.metrics.linksCount.external}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Images: {analysis.metrics.imagesCount} ({analysis.metrics.imagesWithAlt} with alt)
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Keywords</h5>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(analysis.keywordDensity).map(([keyword, density]) => (
                                  <span
                                    key={keyword}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {keyword} ({density}%)
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                window.history.pushState({}, '', `/dashboard/content-analysis?id=${analysis.id}`);
                                const event = new Event('popstate');
                                window.dispatchEvent(event);
                              }}
                              className="inline-flex items-center px-2.5 py-1.5 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(analysis.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Last modified: {new Date(analysis.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
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