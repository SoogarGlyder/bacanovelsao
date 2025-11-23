import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import ChapterReadPage from './pages/ChapterReadPage.jsx';
import './index.css';

const router = (
  <BrowserRouter>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route index element={<HomePage/>}/>
        <Route path="chapter/:id" element={<ChapterReadPage/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {router}
  </React.StrictMode>
);