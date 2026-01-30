const axios = require('axios');

class VidSrcPro {
    constructor() {
        this.name = 'VidSrc Pro';
        this.baseUrl = 'https://vidsrc.me';
    }

    async getStreams(imdbId, type, extra) {
        try {
            const streams = [];
            // استخدام API وسيط موثوق ومحدث لعام 2026 لاستخراج الروابط المباشرة
            // هذا الـ API يقوم بفك التشفير وجلب الـ m3u8 الحقيقي
            const resolverApis = [
                `https://vidsrc-api.autm.workers.dev/api/source/${imdbId}`,
                `https://vidsrc.xyz/api/source/${imdbId}`
            ];

            if (type === 'series' && extra && extra.season && extra.episode) {
                resolverApis[0] = `https://vidsrc-api.autm.workers.dev/api/source/${imdbId}/${extra.season}/${extra.episode}`;
            }

            for (const api of resolverApis) {
                try {
                    const response = await axios.get(api, { timeout: 5000 });
                    if (response.data && response.data.url) {
                        streams.push({
                            name: 'Badhoven 🚀',
                            title: `🎬 VidSrc Direct - ${response.data.quality || 'Auto'} (m3u8)`,
                            url: response.data.url,
                            behaviorHints: {
                                bingeGroup: 'badhoven-vidsrc-pro',
                                notWebReady: false
                            }
                        });
                        break; // إذا وجدنا رابطاً شغالاً نتوقف
                    }
                } catch (e) {
                    continue;
                }
            }

            // Fallback: الرابط الخارجي كحل أخير
            const embedUrl = type === 'movie' 
                ? `${this.baseUrl}/embed/movie?imdb=${imdbId}`
                : `${this.baseUrl}/embed/tv?imdb=${imdbId}&season=${extra.season}&episode=${extra.episode}`;
            
            streams.push({
                name: 'Badhoven 🌐',
                title: '🌐 VidSrc - External Player',
                externalUrl: embedUrl
            });
            
            return streams;
        } catch (error) {
            return [];
        }
    }
}

module.exports = new VidSrcPro();
