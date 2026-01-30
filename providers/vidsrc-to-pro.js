const axios = require('axios');

class VidSrcToPro {
    constructor() {
        this.name = 'VidSrc.to Pro';
        // استخدام API خارجي موثوق لاستخراج الروابط المباشرة من vidsrc.to
        this.resolverApi = 'https://vidsrc-to-api.vercel.app'; 
    }

    async getStreams(imdbId, type, extra) {
        try {
            const streams = [];
            let resolverUrl;

            if (type === 'movie') {
                resolverUrl = `${this.resolverApi}/api/fetch/${imdbId}`;
            } else if (type === 'series' && extra && extra.season && extra.episode) {
                resolverUrl = `${this.resolverApi}/api/fetch/${imdbId}/${extra.season}/${extra.episode}`;
            }

            if (resolverUrl) {
                try {
                    const response = await axios.get(resolverUrl, { timeout: 8000 });
                    if (response.data && response.data.url) {
                        streams.push({
                            name: 'Badhoven 🚀',
                            title: `🎬 VidSrc.to Pro - ${response.data.quality || 'Direct'} (m3u8)`,
                            url: response.data.url,
                            behaviorHints: {
                                bingeGroup: 'badhoven-vidsrc-to-pro',
                                notWebReady: false
                            }
                        });
                    }
                } catch (e) {
                    console.log(`[${this.name}] Resolver API failed`);
                }
            }

            // Fallback: رابط خارجي
            const embedUrl = type === 'movie' 
                ? `https://vidsrc.to/embed/movie/${imdbId}`
                : `https://vidsrc.to/embed/tv/${imdbId}/${extra.season}/${extra.episode}`;
            
            streams.push({
                name: 'Badhoven 🌐',
                title: '🌐 VidSrc.to - External Player',
                externalUrl: embedUrl
            });
            
            return streams;
            
        } catch (error) {
            console.error(`[${this.name}] Error:`, error.message);
            return [];
        }
    }
}

module.exports = new VidSrcToPro();
