// SuperEmbed Provider for Stremio

const axios = require('axios');

const SuperEmbedProvider = {
    name: 'SuperEmbed',
    enabled: true,
    
    async getStreams(imdbId, type, extra = {}) {
        try {
            const streams = [];
            
            // SuperEmbed format: https://multiembed.mov/?video_id=tt1234567&tmdb=1
            // For TV: add &s=1&e=1
            
            let url = `https://multiembed.mov/?video_id=${imdbId}&tmdb=1`;
            
            if (type === 'series') {
                const season = extra.season || 1;
                const episode = extra.episode || 1;
                url += `&s=${season}&e=${episode}`;
            }
            
            streams.push({
                name: 'SuperEmbed',
                title: '🎬 SuperEmbed\n📺 HD Quality\n⚡ Reliable',
                url: url,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: 'superembed'
                }
            });
            
            return streams;
            
        } catch (error) {
            console.error('[SuperEmbed] Error:', error.message);
            return [];
        }
    }
};

module.exports = SuperEmbedProvider;
