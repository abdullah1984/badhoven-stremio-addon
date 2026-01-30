// VidSrc Provider for Stremio

const axios = require('axios');

const VidSrcProvider = {
    name: 'VidSrc',
    enabled: true,
    
    async getStreams(imdbId, type, extra = {}) {
        try {
            const streams = [];
            
            // VidSrc uses IMDB IDs directly
            // Format: https://vidsrc.me/embed/movie?imdb=tt1234567
            // or: https://vidsrc.me/embed/tv?imdb=tt1234567&season=1&episode=1
            
            let url = `https://vidsrc.me/embed/${type === 'series' ? 'tv' : 'movie'}?imdb=${imdbId}`;
            
            if (type === 'series') {
                const season = extra.season || 1;
                const episode = extra.episode || 1;
                url += `&season=${season}&episode=${episode}`;
            }
            
            streams.push({
                name: 'VidSrc',
                title: '🎬 VidSrc\n📺 Auto Quality',
                url: url,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: 'vidsrc'
                }
            });
            
            return streams;
            
        } catch (error) {
            console.error('[VidSrc] Error:', error.message);
            return [];
        }
    }
};

module.exports = VidSrcProvider;
