import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';

const BASE_URL = 'https://bacanovelsao.vercel.app';

export const generateSitemap = async (req, res) => {
    try {
        const novels = await Novel.find({}, 'novel_slug updatedAt')
            .sort({ updatedAt: -1 })
            .lean();

        const chapters = await Chapter.find({}, 'chapter_slug updatedAt novel')
            .populate({
                path: 'novel',
                select: 'novel_slug'
            })
            .sort({ updatedAt: -1 })
            .lean();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        xml += `
    <url>
        <loc>${BASE_URL}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

        novels.forEach(novel => {
            if (novel.novel_slug) {
                xml += `
    <url>
        <loc>${BASE_URL}/${novel.novel_slug}</loc>
        <lastmod>${new Date(novel.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
            }
        });
        chapters.forEach(chap => {
            if (chap.novel && chap.novel.novel_slug) {
                const loc = `${BASE_URL}/${chap.novel.novel_slug}/${chap.chapter_slug}`;
                
                xml += `
    <url>
        <loc>${loc}</loc>
        <lastmod>${new Date(chap.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
            }
        });
        xml += `</urlset>`;
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate'); 
        res.status(200).send(xml);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).end(); 
    }
};