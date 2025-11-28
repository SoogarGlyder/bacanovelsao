import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';

const BASE_URL = 'https://bacanovelsao.vercel.app';

export const generateSitemap = async (req, res) => {
    try {
        const novels = await Novel.find({}, 'novel_slug updatedAt').sort({ updatedAt: -1 });

        const chapters = await Chapter.find({})
            .populate('novel', 'novel_slug')
            .sort({ updatedAt: -1 }); 

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

             xml += `<url>
            <loc>${BASE_URL}/</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
            </url>`;

        chapters.forEach(chap => {
            const novelSlug = chap.novel ? chap.novel.novel_slug : 'unknown';
            
            const loc = `${BASE_URL}/${novelSlug}/${chap.chapter_slug}`;
            
            xml += `<url>
            <loc>${loc}</loc>
            <lastmod>${chap.updatedAt.toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
            </url>`;
        });

        xml += `</urlset>`;

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate'); 
        res.status(200).send(xml);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).json({ error: 'Failed to generate sitemap.' });
    }
};