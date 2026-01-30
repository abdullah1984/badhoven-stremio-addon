const axios = require('axios');

class EmbedAPI {
    constructor() {
        this.name = 'Embed API';
        this.baseUrl = 'https://www.2embed.cc';
    }

    async getStreams(imdbId, type, extra) {
        try {
            const streams = [];
            
            if (type === 'movie') {
                // محاولة الحصول على رابط مباشر
                const directUrl = await this.getDirectUrl(imdbId, type);
                if (directUrl) {
                    streams.push({
                        name: 'Badhoven',
                        title: '🎬 2Embed - Direct Stream',
                        url: directUrl,
                        behaviorHints: {
                            bingeGroup: 'badhoven-2embed',
                            notWebReady: false
                        }
                    });
                }
                
                // Fallback: رابط خارجي
                streams.push({
                    name: 'Badhoven',
                    title: '🌐 2Embed - External',
                    externalUrl: `${this.baseUrl}/embed/${imdbId}`
                });
                
            } else if (type === 'series' && extra && extra.season && extra.episode) {
                const season = extra.season;
                const episode = extra.episode;
                
                // محاولة الحصول على رابط مباشر
                const directUrl = await this.getDirectUrl(imdbId, type, season, episode);
                if (directUrl) {
                    streams.push({
                        name: 'Badhoven',
                        title: `🎬 2Embed - S${season}E${episode} Direct`,
                        url: directUrl,
                        behaviorHints: {
                            bingeGroup: 'badhoven-2embed',
                            notWebReady: false
                        }
                    });
                }
                
                // Fallback: رابط خارجي
                streams.push({
                    name: 'Badhoven',
                    title: `🌐 2Embed - S${season}E${episode} External`,
                    externalUrl: `${this.baseUrl}/embedtv/${imdbId}&s=${season}&e=${episode}`
                });
            }
            
            return streams;
            
        } catch (error) {
            console.error(`[${this.name}] Error:`, error.message);
            return [];
        }
    }

    async getDirectUrl(imdbId, type, season, episode) {
        try {
            // محاولة سحب الرابط المباشر من 2Embed
            let embedUrl;
            if (type === 'movie') {
                embedUrl = `${this.baseUrl}/embed/${imdbId}`;
            } else {
                embedUrl = `${this.baseUrl}/embedtv/${imdbId}&s=${season}&e=${episode}`;
            }

            // محاولة جلب الصفحة واستخراج رابط M3U8
            const response = await axios.get(embedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.2embed.cc/'
                },
                timeout: 10000
            });

            const html = response.data;
            
            // البحث عن روابط M3U8 في الصفحة
            const m3u8Match = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
            if (m3u8Match) {
                console.log(`[${this.name}] Found M3U8 link`);
                return m3u8Match[0];
            }

            // البحث عن روابط MP4
            const mp4Match = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/i);
            if (mp4Match) {
                console.log(`[${this.name}] Found MP4 link`);
                return mp4Match[0];
            }

            return null;
            
        } catch (error) {
            console.error(`[${this.name}] Direct URL extraction failed:`, error.message);
            return null;
        }
    }
}

module.exports = new EmbedAPI();
