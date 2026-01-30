const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const providers = require('./providers');

// Addon manifest
const manifest = {
    id: 'com.badhoven.stremio',
    version: '1.0.0',
    name: 'Badhoven Streams',
    description: 'Stream movies and TV shows from multiple sources - Created by badhoven',
    
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    
    catalogs: [],
    
    logo: 'https://i.imgur.com/placeholder.png',
    background: 'https://i.imgur.com/placeholder-bg.png',
    
    behaviorHints: {
        configurable: false,
        configurationRequired: false
    }
};

const builder = new addonBuilder(manifest);

// Stream handler
builder.defineStreamHandler(async function(args) {
    console.log(`[Badhoven] Stream request: ${args.type} ${args.id}`);
    
    try {
        const streams = [];
        
        // Extract TMDB ID from IMDB ID (format: tt1234567)
        const imdbId = args.id;
        
        // Get streams from all providers
        const providerPromises = providers.map(provider => 
            provider.getStreams(imdbId, args.type, args.extra)
                .catch(err => {
                    console.error(`[${provider.name}] Error:`, err.message);
                    return [];
                })
        );
        
        const results = await Promise.all(providerPromises);
        
        // Flatten and combine all streams
        results.forEach(providerStreams => {
            if (Array.isArray(providerStreams)) {
                streams.push(...providerStreams);
            }
        });
        
        console.log(`[Badhoven] Found ${streams.length} streams for ${args.id}`);
        
        return { streams };
        
    } catch (error) {
        console.error('[Badhoven] Handler error:', error);
        return { streams: [] };
    }
});

// Start server
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { 
    port: PORT,
    cacheMaxAge: 3600 // Cache for 1 hour
});

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎬 Badhoven Stremio Addon                              ║
║                                                           ║
║   Server running on: http://127.0.0.1:${PORT}               ║
║                                                           ║
║   Install URL:                                            ║
║   http://127.0.0.1:${PORT}/manifest.json                    ║
║                                                           ║
║   Supported providers:                                    ║
║   • VidSrc                                                ║
║   • VidSrc.to                                             ║
║   • 2Embed                                                ║
║   • SuperEmbed                                            ║
║   • MoviesAPI                                             ║
║                                                           ║
║   Made with ❤️ by badhoven                                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
