import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import CanonicalLink from './components/CanonicalLink.jsx';
import HomePage from './pages/HomePage.jsx';
import ChapterReadPage from './pages/ChapterReadPage.jsx';
import NovelDetailPage from './pages/NovelDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PageTracker from './components/PageTracker';
import './index.css';

const router = (
  <HelmetProvider> 
    <BrowserRouter>
      <PageTracker/>
      <ScrollToTop/>
      <CanonicalLink />
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<HomePage/>}/>
          <Route path=":novelSlug" element={<NovelDetailPage/>}/> 
          <Route path=":novelSlug/:chapterSlug" element={<ChapterReadPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {router}
  </React.StrictMode>
);