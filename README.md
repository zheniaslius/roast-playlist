# Praise Playlist

A Next.js application that provides AI-powered feedback on Spotify playlists using OpenAI's ChatGPT API. Get personalized insights, mood analysis, and recommendations for your music collections.

## Features

- 🎵 **Spotify Playlist Analysis**: Submit any Spotify playlist URL for instant AI feedback
- 🤖 **AI-Powered Insights**: Get detailed analysis including mood assessment, strengths, and improvement suggestions
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support
- ⚡ **Real-time Processing**: Instant feedback using OpenAI's ChatGPT API

## Getting Started

### Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Node.js**: Version 18 or higher

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd praise-playlist
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Create a `.env.local` file in the project root
   - Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage

1. Enter a Spotify playlist URL in the input field
2. Click "Get AI Feedback"
3. Wait for the AI to analyze your playlist
4. Review the personalized feedback and recommendations

For detailed setup instructions, see [AI_FEEDBACK_SETUP.md](./AI_FEEDBACK_SETUP.md).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
