const axios = require('axios');

class EmbedAPI {
    constructor() {
        this.name = 'Embed API';
        this.baseUrl = 'https://www.2embed.cc';
    }

    async getStreams(imdbId, type, extra) {
        try {
            const streams = [];
            
            // محاولة جلب روابط مباشرة من API بديل لـ 2Embed
            const altApi = `https://2embed.org/api/queries?id=${imdbId}`;
            try {
                const response = await axios.get(altApi, { timeout: 5000 });
                if (response.data && response.data.streams) {
                    response.data.streams.forEach(s => {
                        streams.push({
                            name: 'Badhoven 🚀',
                            title: `🎬 2Embed Pro - ${s.quality || 'HD'} (m3u8)`,
                            url: s.link,
                            behaviorHints: {
                                bingeGroup: 'badhoven-2embed',
                                notWebReady: false
                            }
                        });
                    });
                }
            } catch (e) {
                // Ignore error
            }

            // Fallback: رابط خارجي
            const embedUrl = type === 'movie' 
                ? `${this.baseUrl}/embed/${imdbId}`
                : `${this.baseUrl}/embedtv/${imdbId}&s=${extra.season}&e=${extra.episode}`;
            
            streams.push({
                name: 'Badhoven 🌐',
                title: '🌐 2Embed - External Player',
                externalUrl: embedUrl
            });
            
            return streams;
            
        } catch (error) {
            console.error(`[${this.name}] Error:`, error.message);
            return [];
        }
    }
}

module.exports = new EmbedAPI();
