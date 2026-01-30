// MoviesAPI Provider for Stremio

const axios = require('axios');

const MoviesAPIProvider = {
    name: 'MoviesAPI',
    enabled: true,
    
    async getStreams(imdbId, type, extra = {}) {
        try {
            const streams = [];
            
            // MoviesAPI format: https://moviesapi.club/movie/tt1234567
            // For TV: https://moviesapi.club/tv/tt1234567-1-1
            
            let url = `https://moviesapi.club/${type === 'series' ? 'tv' : 'movie'}/${imdbId}`;
            
            if (type === 'series') {
                const season = extra.season || 1;
                const episode = extra.episode || 1;
                url += `-${season}-${episode}`;
            }
            
            streams.push({
                name: 'MoviesAPI',
                title: '🎬 MoviesAPI\n📺 Fast Streaming\n🎯 Direct Links',
                url: url,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: 'moviesapi'
                }
            });
            
            return streams;
            
        } catch (error) {
            console.error('[MoviesAPI] Error:', error.message);
            return [];
        }
    }
};

module.exports = MoviesAPIProvider;
