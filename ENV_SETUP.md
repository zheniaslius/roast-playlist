# Environment Variables Setup

To use the Spotify API integration, you need to set up the following environment variables in your `.env.local` file:

## Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Get your Client ID and Client Secret

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

## OpenAI API Key

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Create .env.local

Create a `.env.local` file in your project root with the above variables.

**Note:** Never commit your `.env.local` file to version control!
