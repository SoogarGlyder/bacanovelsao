import { useState, useEffect, useCallback } from 'react';

// ====================================================================
// 1. Hook untuk mengambil daftar novel berdasarkan seri (TIDAK DIUBAH)
// ====================================================================

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

// ===================================================================
// 2. Hook untuk mengambil data chapter, daftar chapter, dan navigasi
// ===================================================================

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

        const response = await fetch(`/api/chapters/slug/${chapterSlug}?novelSlug=${novelSlug}`);
        
        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error(errorText || 'Chapter atau Novel tidak ditemukan.');
        }

        const data = await response.json(); 
        
        const chapterData = data.chapterDetail;
        const allChaptersData = data.allChapters; 

        if (!chapterData || !chapterData.novel || !allChaptersData) {
            throw new Error('Struktur data API tidak lengkap atau Novel tidak terisi.');
        }

        setChapter(chapterData);
        setPageSerie(chapterData.novel.serie);

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
        setChapter(null); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [chapterSlug, setPageSerie, novelSlug]); 

  return { chapter, loading, error, prevChapterSlug, nextChapterSlug, allChapters };
}

// ===================================================================
// 3. HOOK MENGAMBIL NOVEL DETAIL DAN CHAPTERS
// ===================================================================

export const useNovelDetail = (novelSlug) => {
    const [data, setData] = useState({ novel: null, chapters: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!novelSlug) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/novels/slug/${novelSlug}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Gagal memuat detail novel.');
                }
                
                const result = await response.json();
                
                if (!result.novel || !result.chapters) {
                     throw new Error('Struktur data API detail novel tidak lengkap.');
                }

                setData(result); 

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [novelSlug]);

    return { novel: data.novel, chapters: data.chapters, loading, error };
};