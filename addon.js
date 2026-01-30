const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const providers = require('./providers');

const manifest = {
    id: 'com.badhoven.stremio.fixed', // تغيير الـ ID لإجبار ستريمو على اعتباره إضافة جديدة
    version: '3.0.0',
    name: 'Badhoven DIRECT 🚀',
    description: 'Direct m3u8/mp4 links ONLY - Fixed by Manus',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: [],
    behaviorHints: {
        configurable: false,
        configurationRequired: false
    }
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async function(args) {
    console.log(`[Badhoven] NEW Request: ${args.type} ${args.id}`);
    
    try {
        const streams = [];
        const imdbId = args.id;
        
        // جلب الروابط من المزودين المحدثين فقط
        const providerPromises = providers.map(provider => 
            provider.getStreams(imdbId, args.type, args.extra)
                .catch(err => {
                    console.error(`[${provider.name}] Error:`, err.message);
                    return [];
                })
        );
        
        const results = await Promise.all(providerPromises);
        
        results.forEach(providerStreams => {
            if (Array.isArray(providerStreams)) {
                // تصفية الروابط لإبقاء الروابط المباشرة فقط (التي تحتوي على url)
                // واستبعاد الروابط التي تحتوي على "embed" في الـ url
                const directOnly = providerStreams.filter(s => 
                    s.url && !s.url.includes('embed') && !s.url.includes('vidsrc.me') && !s.url.includes('vidsrc.to')
                );
                streams.push(...directOnly);
            }
        });

        console.log(`[Badhoven] Found ${streams.length} DIRECT streams`);
        
        return { 
            streams: streams,
            cacheMaxAge: 0 // تعطيل الكاش تماماً للتجربة
        };
        
    } catch (error) {
        console.error('[Badhoven] Handler error:', error);
        return { streams: [] };
    }
});

const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });
