import { useState, useEffect, useCallback } from 'react';

// =================================================================
// 1. Hook untuk mengambil daftar novel berdasarkan seri
// =================================================================

export function useNovelList(serie) {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNovels = async () => {
      if (!serie) return; 

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/novels?serie=${serie}`);
        if (!response.ok) throw new Error('Gagal mengambil data novel');
        const data = await response.json();
        setNovels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNovels();
  }, [serie]);

  return { novels, loading, error };
}

// =================================================================
// 2. Utility Hook untuk menemukan slug chapter pertama
// =================================================================

export const useFirstChapterFetcher = () => {
  const fetchFirstChapterSlug = useCallback(async (novelId) => {
    try {
      const response = await fetch(`/api/novels/find-first-chapter/${novelId}`);
      if (!response.ok) {
        throw new Error('Tidak bisa menemukan chapter pertama.');
      }
      const data = await response.json();
      return data.firstChapterSlug;
    } catch (err) {
      console.error('Error fetching first chapter slug:', err);
      throw err;
    }
  }, []);

  return fetchFirstChapterSlug;
};

// =================================================================
// 3. Hook untuk mengambil data chapter, daftar chapter, dan navigasi
// =================================================================

export function useChapterData(novelSlug, chapterSlug, setPageSerie) {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevChapterSlug, setPrevChapterSlug] = useState(null);
  const [nextChapterSlug, setNextChapterSlug] = useState(null);
  const [allChapters, setAllChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!novelSlug || !chapterSlug) return;
      
      try {
        setLoading(true);
        setError(null);
        setPrevChapterSlug(null);
        setNextChapterSlug(null);

        const chapterResponse = await fetch(`/api/chapters/slug/${chapterSlug}?novelSlug=${novelSlug}`);
        if (!chapterResponse.ok) throw new Error('Chapter tidak ditemukan');

        const chapterData = await chapterResponse.json();
        setChapter(chapterData);
        setPageSerie(chapterData.novel.serie);
        document.title = `${chapterData.novel.title} - ${chapterData.title}`;

        const novelId = chapterData.novel._id;
        
        const allChaptersResponse = await fetch(`/api/chapters/novel/${novelId}`);
        if (!allChaptersResponse.ok) throw new Error('Gagal mengambil daftar chapter');

        const allChaptersData = await allChaptersResponse.json();
        setAllChapters(allChaptersData);

        const currentIndex = allChaptersData.findIndex(c => c.chapter_slug === chapterSlug);

        if (currentIndex > 0) {
          setPrevChapterSlug(allChaptersData[currentIndex - 1].chapter_slug);
        }

        if (currentIndex < allChaptersData.length - 1) {
          setNextChapterSlug(allChaptersData[currentIndex + 1].chapter_slug);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      document.title = "Baca Novel SAO";
    };
  }, [chapterSlug, setPageSerie, novelSlug]); 

  return { chapter, loading, error, prevChapterSlug, nextChapterSlug, allChapters };
}