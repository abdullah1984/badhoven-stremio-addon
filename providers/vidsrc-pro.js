const axios = require('axios');

class VidSrcPro {
    constructor() {
        this.name = 'VidSrc Pro';
    }

    async getStreams(imdbId, type, extra) {
        const streams = [];
        try {
            // استخدام API استخراج مباشر وقوي (هذا الـ API يعيد روابط m3u8 مباشرة)
            let resolverUrl = `https://vidsrc-api.autm.workers.dev/api/source/${imdbId}`;
            if (type === 'series' && extra && extra.season && extra.episode) {
                resolverUrl = `https://vidsrc-api.autm.workers.dev/api/source/${imdbId}/${extra.season}/${extra.episode}`;
            }

            const response = await axios.get(resolverUrl, { timeout: 8000 });
            
            if (response.data && response.data.url) {
                // التأكد من أن الرابط هو m3u8 أو mp4
                if (response.data.url.includes('.m3u8') || response.data.url.includes('.mp4') || response.data.url.includes('playlist')) {
                    streams.push({
                        name: 'Badhoven 🚀',
                        title: `🎬 Direct Stream - ${response.data.quality || 'Auto'}`,
                        url: response.data.url,
                        behaviorHints: {
                            notWebReady: false
                        }
                    });
                }
            }
            
            // محاولة مصدر بديل (Vidsrc.xyz API)
            const altUrl = `https://vidsrc.xyz/api/source/${imdbId}`;
            const altRes = await axios.get(altUrl).catch(() => null);
            if (altRes && altRes.data && altRes.data.url) {
                streams.push({
                    name: 'Badhoven 🚀',
                    title: `🎬 Backup Direct - ${altRes.data.quality || 'HD'}`,
                    url: altRes.data.url,
                    behaviorHints: {
                        notWebReady: false
                    }
                });
            }

        } catch (error) {
            console.error(`[VidSrcPro] Error: ${error.message}`);
        }
        return streams;
    }
}

module.exports = new VidSrcPro();
