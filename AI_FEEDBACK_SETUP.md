# AI Feedback Setup Guide

## Overview

The Praise Playlist app now includes AI-powered feedback using OpenAI's ChatGPT API. When users submit a Spotify playlist URL, the app sends it to the server, which then calls the ChatGPT API to generate personalized feedback.

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_api_key_here

# Optional: Customize AI behavior
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
```

### 3. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## How It Works

### Frontend Flow

1. User enters Spotify playlist URL
2. Frontend validates the URL format
3. Sends POST request to `/api/ai-feedback` with the URL
4. Displays loading state while waiting for response
5. Shows AI-generated feedback or error message

### Backend Flow

1. API route receives Spotify URL
2. Validates URL format and required fields
3. Calls OpenAI ChatGPT API with custom prompt
4. Returns AI-generated feedback to frontend

### AI Prompt

The system uses a custom prompt that instructs ChatGPT to:

- Act as a music expert and playlist curator
- Provide overall vibe and mood assessment
- Identify strengths and areas for improvement
- Give specific song recommendations
- Provide a mood score (1-10)
- Use friendly, encouraging tone with emojis

## API Endpoint

**POST** `/api/ai-feedback`

**Request Body:**

```json
{
  "spotifyUrl": "https://open.spotify.com/playlist/..."
}
```

**Response:**

```json
{
  "feedback": "AI-generated feedback text...",
  "spotifyUrl": "https://open.spotify.com/playlist/..."
}
```

## Error Handling

The API includes comprehensive error handling for:

- Missing Spotify URL
- Invalid URL format
- Missing OpenAI API key
- OpenAI API failures
- Server errors

## Security Notes

- Never commit your `.env.local` file to version control
- The API key is only used server-side
- Input validation prevents malicious URLs
- Rate limiting can be added if needed

## Customization

You can customize the AI behavior by modifying:

- The system prompt in `src/app/api/ai-feedback/route.ts`
- Model parameters (temperature, max tokens)
- Response format and structure
