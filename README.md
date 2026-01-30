# 🎬 Badhoven Stremio Addon

Stremio addon by **badhoven** - Stream movies and TV shows from multiple sources

## Features

- 🌐 **5 Streaming Sources**: VidSrc, VidSrc.to, 2Embed, SuperEmbed, MoviesAPI
- 🎬 **Movies Support**: Full support for movies
- 📺 **TV Shows Support**: Full support for series with seasons and episodes
- ⚡ **Fast & Reliable**: Quick stream loading from multiple providers
- 🔄 **Auto Fallback**: Multiple sources ensure availability
- 🎯 **Direct Integration**: Works seamlessly with Stremio

## Supported Providers

| Provider | Movies | TV Shows | Quality |
|----------|--------|----------|---------|
| **VidSrc** | ✅ | ✅ | Auto |
| **VidSrc.to** | ✅ | ✅ | Auto |
| **2Embed** | ✅ | ✅ | Multiple Servers |
| **SuperEmbed** | ✅ | ✅ | HD |
| **MoviesAPI** | ✅ | ✅ | Fast |

## Installation

### Method 1: Local Installation (Recommended for Development)

1. **Clone or download this repository**

2. **Install dependencies:**
```bash
npm install
```

3. **Start the addon:**
```bash
npm start
```

4. **Install in Stremio:**
   - Open Stremio
   - Go to Addons
   - Click the puzzle icon (🧩) in the top right
   - Paste this URL: `http://127.0.0.1:7000/manifest.json`
   - Click Install

### Method 2: Deploy to Cloud (For Public Use)

You can deploy this addon to various platforms:

#### Deploy to Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Run:
```bash
heroku create badhoven-addon
git push heroku master
```

#### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

#### Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Connect your GitHub repository
4. Deploy automatically

After deployment, use your public URL + `/manifest.json` to install in Stremio.

## Usage

1. **Search for content** in Stremio (movies or TV shows)
2. **Select any title** you want to watch
3. **Click on the title** to see available streams
4. **Choose a stream** from Badhoven addon
5. **Enjoy!** 🍿

## Configuration

### Change Port

Edit `addon.js` or set environment variable:
```bash
PORT=8080 npm start
```

### Enable/Disable Providers

Edit `providers/index.js` and comment out providers you don't want:
```javascript
module.exports = [
    vidsrc,
    // vidsrcTo,  // Disabled
    twoEmbed,
    // superEmbed,  // Disabled
    moviesApi
];
```

### Add New Provider

1. Create a new file in `providers/` folder (e.g., `newprovider.js`)
2. Follow this template:

```javascript
const NewProvider = {
    name: 'NewProvider',
    enabled: true,
    
    async getStreams(imdbId, type, extra = {}) {
        try {
            const streams = [];
            
            // Build your URL
            let url = `https://yoursite.com/embed/${imdbId}`;
            
            if (type === 'series') {
                const season = extra.season || 1;
                const episode = extra.episode || 1;
                url += `/${season}/${episode}`;
            }
            
            streams.push({
                name: 'NewProvider',
                title: '🎬 NewProvider\n📺 Description',
                url: url,
                behaviorHints: {
                    notWebReady: true
                }
            });
            
            return streams;
        } catch (error) {
            console.error('[NewProvider] Error:', error.message);
            return [];
        }
    }
};

module.exports = NewProvider;
```

3. Add it to `providers/index.js`:
```javascript
const newProvider = require('./newprovider');

module.exports = [
    // ... other providers
    newProvider
];
```

## Project Structure

```
badhoven-stremio-addon/
├── addon.js              # Main addon file
├── package.json          # Dependencies
├── providers/            # Stream providers
│   ├── index.js         # Providers export
│   ├── vidsrc.js        # VidSrc provider
│   ├── vidsrc-to.js     # VidSrc.to provider
│   ├── 2embed.js        # 2Embed provider
│   ├── superembed.js    # SuperEmbed provider
│   └── moviesapi.js     # MoviesAPI provider
├── README.md            # This file
└── INSTALL_GUIDE.md     # Detailed installation guide
```

## How It Works

1. **User requests a stream** in Stremio
2. **Stremio sends request** to addon with IMDB ID
3. **Addon queries all providers** in parallel
4. **Providers return stream URLs**
5. **Addon combines and returns** all streams to Stremio
6. **User selects preferred stream**

## Troubleshooting

### Addon not showing in Stremio
- Make sure the server is running
- Check if the URL is correct: `http://127.0.0.1:7000/manifest.json`
- Try restarting Stremio

### No streams available
- Some content might not be available on all providers
- Try different providers
- Check if the IMDB ID is correct

### Streams not playing
- Some streams require specific players
- Try opening in external browser
- Check your internet connection

## Development

### Run in development mode with auto-reload:
```bash
npm run dev
```

### Test the addon:
```bash
# Test manifest
curl http://127.0.0.1:7000/manifest.json

# Test stream for a movie (Oppenheimer - tt15398776)
curl http://127.0.0.1:7000/stream/movie/tt15398776.json

# Test stream for a TV show (Breaking Bad S01E01 - tt0903747)
curl "http://127.0.0.1:7000/stream/series/tt0903747:1:1.json"
```

## API Endpoints

- `GET /manifest.json` - Addon manifest
- `GET /stream/{type}/{id}.json` - Get streams for content
  - For movies: `/stream/movie/tt1234567.json`
  - For series: `/stream/series/tt1234567:1:1.json` (season:episode)

## Requirements

- Node.js 14.x or higher
- npm or yarn
- Internet connection

## License

MIT License - Feel free to use and modify

## Disclaimer

- This addon does not host any content
- All streams are provided by third-party sources
- Users are responsible for compliance with local laws
- For DMCA concerns, contact the actual content hosts

## Credits

Created with ❤️ by **badhoven**

Built using:
- [Stremio Addon SDK](https://github.com/Stremio/stremio-addon-sdk)
- Node.js
- Various streaming sources

## Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the installation guide

---

**Enjoy streaming! 🎬🍿**
