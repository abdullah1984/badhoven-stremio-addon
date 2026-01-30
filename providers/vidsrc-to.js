// VidSrc.to Provider for Stremio

const axios = require('axios');

const VidSrcToProvider = {
    name: 'VidSrc.to',
    enabled: true,
    
    async getStreams(imdbId, type, extra = {}) {
        try {
            const streams = [];
            
            // VidSrc.to format: https://vidsrc.to/embed/movie/tt1234567
            // or: https://vidsrc.to/embed/tv/tt1234567/1/1
            
            let url = `https://vidsrc.to/embed/${type === 'series' ? 'tv' : 'movie'}/${imdbId}`;
            
            if (type === 'series') {
                const season = extra.season || 1;
                const episode = extra.episode || 1;
                url += `/${season}/${episode}`;
            }
            
            streams.push({
                name: 'VidSrc.to',
                title: '🎬 VidSrc.to\n📺 Auto Quality\n⚡ Fast Server',
                url: url,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: 'vidsrc-to'
                }
            });
            
            return streams;
            
        } catch (error) {
            console.error('[VidSrc.to] Error:', error.message);
            return [];
        }
    }
};

module.exports = VidSrcToProvider;
