const axios = require('axios');

class VidSrcPro {
    constructor() {
        this.name = 'VidSrc Pro';
        // استخدام API خارجي موثوق لاستخراج الروابط المباشرة
        this.resolverApi = 'https://vidsrc-api-v7.vercel.app'; 
    }

    async getStreams(imdbId, type, extra) {
        try {
            const streams = [];
            let resolverUrl;

            if (type === 'movie') {
                resolverUrl = `${this.resolverApi}/api/source/${imdbId}`;
            } else if (type === 'series' && extra && extra.season && extra.episode) {
                resolverUrl = `${this.resolverApi}/api/source/${imdbId}/${extra.season}/${extra.episode}`;
            }

            if (resolverUrl) {
                try {
                    const response = await axios.get(resolverUrl, { timeout: 8000 });
                    if (response.data && response.data.url) {
                        streams.push({
                            name: 'Badhoven 🚀',
                            title: `🎬 VidSrc Pro - ${response.data.quality || 'Direct'} (m3u8)`,
                            url: response.data.url,
                            behaviorHints: {
                                bingeGroup: 'badhoven-vidsrc-pro',
                                notWebReady: false
                            }
                        });
                    }
                } catch (e) {
                    console.log(`[${this.name}] Resolver API failed, trying fallback extraction`);
                }
            }

            // Fallback: محاولة الاستخراج اليدوي إذا فشل الـ API
            const directUrl = await this.getDirectUrl(imdbId, type, extra?.season, extra?.episode);
            if (directUrl) {
                streams.push({
                    name: 'Badhoven 🚀',
                    title: '🎬 VidSrc Pro - Direct Stream (m3u8)',
                    url: directUrl,
                    behaviorHints: {
                        bingeGroup: 'badhoven-vidsrc-pro',
                        notWebReady: false
                    }
                });
            }
            
            // Fallback: رابط خارجي (كحل أخير)
            const embedUrl = type === 'movie' 
                ? `https://vidsrc.me/embed/movie?imdb=${imdbId}`
                : `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${extra.season}&episode=${extra.episode}`;
            
            streams.push({
                name: 'Badhoven 🌐',
                title: '🌐 VidSrc - External Player',
                externalUrl: embedUrl
            });
            
            return streams;
            
        } catch (error) {
            console.error(`[${this.name}] Error:`, error.message);
            return [];
        }
    }

    async getDirectUrl(imdbId, type, season, episode) {
        try {
            // محاولة استخدام vidsrc.xyz كبديل
            const baseUrl = 'https://vidsrc.xyz';
            let embedUrl = type === 'movie' 
                ? `${baseUrl}/embed/movie/${imdbId}`
                : `${baseUrl}/embed/tv/${imdbId}/${season}/${episode}`;

            const response = await axios.get(embedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://vidsrc.xyz/'
                },
                timeout: 5000
            });

            const html = response.data;
            const m3u8Match = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
            return m3u8Match ? m3u8Match[0] : null;
            
        } catch (error) {
            return null;
        }
    }
}

module.exports = new VidSrcPro();
