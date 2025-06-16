# API Setup Guide

This dashboard supports integration with real APIs to fetch live data instead of using mock data. Follow this guide to set up your API connections.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here

# Kajabi API  
KAJABI_API_KEY=your_kajabi_api_key_here

# Cal.com API
CALCOM_API_KEY=your_calcom_api_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
```

## API Setup Instructions

### 1. YouTube Data API v3

1. Go to [Google Developers Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to `YOUTUBE_API_KEY`
6. Find your channel ID and add it to `YOUTUBE_CHANNEL_ID`

**Finding your YouTube Channel ID:**
- Go to your YouTube channel
- View page source and search for "externalId" 
- Or use: `https://www.youtube.com/account_advanced`

### 2. Kajabi API

1. Log in to your Kajabi account
2. Go to Settings > Integrations > API
3. Generate a new API key
4. Copy the API key to `KAJABI_API_KEY`

**Kajabi API Documentation:** [docs.kajabi.com](https://developers.kajabi.com/)

### 3. Cal.com API

1. Log in to your Cal.com account
2. Go to Settings > Developer > API Keys
3. Create a new API key
4. Copy the API key to `CALCOM_API_KEY`

**Cal.com API Documentation:** [cal.com/docs/api](https://cal.com/docs/api)

### 4. OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the API key to `OPENAI_API_KEY`

**Note:** This requires an OpenAI account with billing set up.

## API Status

The dashboard will automatically detect which APIs are configured and show their status:

- **Connected**: API key is present and working
- **Mock**: No API key found, using realistic mock data
- **Error**: API key present but requests are failing

You can view the API status in the browser console or add it to the UI.

## Data Flow

When APIs are connected:

1. **YouTube API** → Channel stats, video performance data
2. **Kajabi API** → Revenue data, product sales, email campaign stats  
3. **Cal.com API** → Booking data, call acceptance rates
4. **OpenAI API** → AI-generated insights and recommendations

When APIs are not connected, the system falls back to realistic mock data that follows the same structure.

## Troubleshooting

### Common Issues:

1. **CORS Errors**: API calls are made server-side to avoid CORS issues
2. **Rate Limits**: Each API has rate limits - the system includes error handling
3. **Invalid Keys**: Check that your API keys are correctly copied and have proper permissions

### Testing API Connections:

Check the browser console for log messages like:
- `🎥 YouTube API: Using mock data (add YOUTUBE_API_KEY to use real data)`
- `💰 Kajabi API: Connected and fetching real data`

## Development vs Production

- **Development**: Use mock data or test API keys
- **Production**: Ensure all environment variables are set in your deployment platform

For Vercel deployment, add environment variables in the Vercel dashboard under Settings > Environment Variables. 