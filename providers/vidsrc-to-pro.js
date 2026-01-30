const axios = require('axios');

class VidSrcToPro {
    constructor() {
        this.name = 'VidSrc.to Pro';
        this.baseUrl = 'https://vidsrc.to';
    }

    async getStreams(imdbId, type, extra) {
        try {
            const streams = [];
            // استخدام محرك استخراج متطور لـ vidsrc.to
            const resolverUrl = type === 'movie'
                ? `https://vidsrc-to-resolver.vercel.app/api/fetch/${imdbId}`
                : `https://vidsrc-to-resolver.vercel.app/api/fetch/${imdbId}/${extra.season}/${extra.episode}`;

            try {
                const response = await axios.get(resolverUrl, { timeout: 6000 });
                if (response.data && response.data.url) {
                    streams.push({
                        name: 'Badhoven 🚀',
                        title: `🎬 VidSrc.to Direct - ${response.data.quality || 'HD'} (m3u8)`,
                        url: response.data.url,
                        behaviorHints: {
                            bingeGroup: 'badhoven-vidsrc-to-pro',
                            notWebReady: false
                        }
                    });
                }
            } catch (e) {
                // Fallback to manual extraction logic if API fails
            }

            // Fallback: الرابط الخارجي
            const embedUrl = type === 'movie' 
                ? `${this.baseUrl}/embed/movie/${imdbId}`
                : `${this.baseUrl}/embed/tv/${imdbId}/${extra.season}/${extra.episode}`;
            
            streams.push({
                name: 'Badhoven 🌐',
                title: '🌐 VidSrc.to - External Player',
                externalUrl: embedUrl
            });
            
            return streams;
        } catch (error) {
            return [];
        }
    }
}

module.exports = new VidSrcToPro();
