// 2Embed Provider for Stremio

const axios = require('axios');

const TwoEmbedProvider = {
    name: '2Embed',
    enabled: true,
    
    async getStreams(imdbId, type, extra = {}) {
        try {
            const streams = [];
            
            // 2Embed format: https://www.2embed.cc/embed/tt1234567
            // or for TV: https://www.2embed.cc/embedtv/tt1234567&s=1&e=1
            
            let url;
            
            if (type === 'series') {
                const season = extra.season || 1;
                const episode = extra.episode || 1;
                url = `https://www.2embed.cc/embedtv/${imdbId}&s=${season}&e=${episode}`;
            } else {
                url = `https://www.2embed.cc/embed/${imdbId}`;
            }
            
            streams.push({
                name: '2Embed',
                title: '🎬 2Embed\n📺 Multiple Servers\n🌐 Global Access',
                url: url,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: '2embed'
                }
            });
            
            return streams;
            
        } catch (error) {
            console.error('[2Embed] Error:', error.message);
            return [];
        }
    }
};

module.exports = TwoEmbedProvider;
