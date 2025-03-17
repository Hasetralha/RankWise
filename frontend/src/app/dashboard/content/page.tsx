'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

interface ContentAnalysis {
  readability: {
    score: number;
    level: string;
    suggestions: string[];
  };
  seo: {
    score: number;
    suggestions: string[];
  };
  keywords: {
    main: string[];
    related: string[];
  };
}

export default function ContentAnalysisPage() {
  const [content, setContent] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeContent = () => {
    setLoading(true);
    
    // This is a mock analysis. In a real application, you would call an API
    setTimeout(() => {
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const sentences = content.split(/[.!?]+/).filter(Boolean).length;
      const avgWordsPerSentence = wordCount / sentences;
      
      const keywords = targetKeywords.split(',').map(k => k.trim().toLowerCase());
      const contentLower = content.toLowerCase();
      const keywordDensity = keywords.map(k => ({
        keyword: k,
        count: (contentLower.match(new RegExp(k, 'g')) || []).length,
        density: ((contentLower.match(new RegExp(k, 'g')) || []).length / wordCount) * 100
      }));

      const analysis: ContentAnalysis = {
        readability: {
          score: Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 5)),
          level: avgWordsPerSentence <= 14 ? 'Easy to Read' : avgWordsPerSentence <= 18 ? 'Moderate' : 'Complex',
          suggestions: [
            avgWordsPerSentence > 20 ? 'Try to shorten your sentences for better readability' : '',
            wordCount < 300 ? 'Consider adding more content for better SEO' : '',
            sentences < 3 ? 'Add more sentences to improve content structure' : '',
          ].filter(Boolean),
        },
        seo: {
          score: Math.min(100, Math.max(0, keywordDensity.reduce((acc, k) => {
            if (k.density < 0.5) return acc - 10;
            if (k.density > 2.5) return acc - 15;
            return acc;
          }, 100))),
          suggestions: [
            ...keywordDensity.map(k => {
              if (k.density < 0.5) return `Increase usage of keyword "${k.keyword}"`;
              if (k.density > 2.5) return `Reduce usage of keyword "${k.keyword}" to avoid keyword stuffing`;
              return '';
            }),
            wordCount < 300 ? 'Content length is below recommended minimum of 300 words' : '',
            !content.includes('<h1') ? 'Add an H1 heading to your content' : '',
            !content.includes('<h2') ? 'Consider adding H2 subheadings' : '',
          ].filter(Boolean),
        },
        keywords: {
          main: keywordDensity.map(k => `${k.keyword} (${k.count} times, ${k.density.toFixed(1)}%)`),
          related: keywords.map(k => k + 's').filter(k => contentLower.includes(k)), // Simple related keywords demo
        },
      };

      setAnalysis(analysis);
      setLoading(false);
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Content Analysis</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analyze your content for SEO optimization and readability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Input Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Keywords</label>
                  <input
                    type="text"
                    value={targetKeywords}
                    onChange={(e) => setTargetKeywords(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter keywords, separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Paste your content here"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={analyzeContent}
                    disabled={loading || !content}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Content'}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>
              
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}

              {!loading && !analysis && (
                <p className="text-gray-500 text-sm">
                  Enter your content and click "Analyze Content" to see the results here.
                </p>
              )}

              {!loading && analysis && (
                <div className="space-y-6">
                  {/* Readability Score */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Readability</h4>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${analysis.readability.score}%` }}
                            />
                          </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {analysis.readability.score}/100
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{analysis.readability.level}</p>
                    </div>
                  </div>

                  {/* SEO Score */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">SEO Score</h4>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-indigo-500 rounded-full"
                              style={{ width: `${analysis.seo.score}%` }}
                            />
                          </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {analysis.seo.score}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Keyword Analysis */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Keyword Analysis</h4>
                    <div className="mt-2 space-y-2">
                      {analysis.keywords.main.map((keyword, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Suggestions</h4>
                    <ul className="mt-2 space-y-1">
                      {[...analysis.readability.suggestions, ...analysis.seo.suggestions].map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
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