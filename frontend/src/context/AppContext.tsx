'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MetaTag {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  createdAt: string;
  lastModified: string;
}

interface ContentAnalysis {
  id: string;
  url: string;
  score: number;
  suggestions: string[];
  keywordDensity: { [key: string]: number };
  metrics: {
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
  };
  createdAt: string;
  lastModified: string;
}

interface Sitemap {
  id: string;
  websiteUrl: string;
  totalUrls: number;
  lastGenerated: string;
  settings: {
    changeFrequency: string;
    priority: string;
    includeImages: boolean;
  };
  generatedXml?: string;
}

interface AppContextType {
  metaTags: MetaTag[];
  contentAnalyses: ContentAnalysis[];
  sitemaps: Sitemap[];
  addMetaTag: (metaTag: MetaTag) => void;
  updateMetaTag: (id: string, metaTag: MetaTag) => void;
  deleteMetaTag: (id: string) => void;
  addContentAnalysis: (analysis: ContentAnalysis) => void;
  updateContentAnalysis: (id: string, analysis: ContentAnalysis) => void;
  deleteContentAnalysis: (id: string) => void;
  addSitemap: (sitemap: Sitemap) => void;
  updateSitemap: (id: string, sitemap: Sitemap) => void;
  deleteSitemap: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
  const [contentAnalyses, setContentAnalyses] = useState<ContentAnalysis[]>([]);
  const [sitemaps, setSitemaps] = useState<Sitemap[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const loadedMetaTags = localStorage.getItem('metaTags');
    const loadedContentAnalyses = localStorage.getItem('contentAnalyses');
    const loadedSitemaps = localStorage.getItem('sitemaps');

    if (loadedMetaTags) setMetaTags(JSON.parse(loadedMetaTags));
    if (loadedContentAnalyses) setContentAnalyses(JSON.parse(loadedContentAnalyses));
    if (loadedSitemaps) setSitemaps(JSON.parse(loadedSitemaps));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('metaTags', JSON.stringify(metaTags));
  }, [metaTags]);

  useEffect(() => {
    localStorage.setItem('contentAnalyses', JSON.stringify(contentAnalyses));
  }, [contentAnalyses]);

  useEffect(() => {
    localStorage.setItem('sitemaps', JSON.stringify(sitemaps));
  }, [sitemaps]);

  const addMetaTag = (metaTag: MetaTag) => {
    setMetaTags(prev => [metaTag, ...prev]);
  };

  const updateMetaTag = (id: string, metaTag: MetaTag) => {
    setMetaTags(prev => prev.map(tag => tag.id === id ? metaTag : tag));
  };

  const deleteMetaTag = (id: string) => {
    setMetaTags(prev => prev.filter(tag => tag.id !== id));
  };

  const addContentAnalysis = (analysis: ContentAnalysis) => {
    setContentAnalyses(prev => [analysis, ...prev]);
  };

  const updateContentAnalysis = (id: string, analysis: ContentAnalysis) => {
    setContentAnalyses(prev => prev.map(item => item.id === id ? analysis : item));
  };

  const deleteContentAnalysis = (id: string) => {
    setContentAnalyses(prev => prev.filter(item => item.id !== id));
  };

  const addSitemap = (sitemap: Sitemap) => {
    setSitemaps(prev => [sitemap, ...prev]);
  };

  const updateSitemap = (id: string, sitemap: Sitemap) => {
    setSitemaps(prev => prev.map(item => item.id === id ? sitemap : item));
  };

  const deleteSitemap = (id: string) => {
    setSitemaps(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        metaTags,
        contentAnalyses,
        sitemaps,
        addMetaTag,
        updateMetaTag,
        deleteMetaTag,
        addContentAnalysis,
        updateContentAnalysis,
        deleteContentAnalysis,
        addSitemap,
        updateSitemap,
        deleteSitemap,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 