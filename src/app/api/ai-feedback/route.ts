import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function POST(request: NextRequest) {
  try {
    const { spotifyUrl } = await request.json();

    if (!spotifyUrl) {
      return NextResponse.json(
        { error: "Spotify URL is required" },
        { status: 400 }
      );
    }

    if (!spotifyUrl.includes("open.spotify.com/playlist/")) {
      return NextResponse.json(
        { error: "Invalid Spotify playlist URL" },
        { status: 400 }
      );
    }

    // Extract playlist ID from URL
    const playlistId = spotifyUrl.split("playlist/")[1]?.split("?")[0];

    if (!playlistId) {
      return NextResponse.json(
        { error: "Could not extract playlist ID from URL" },
        { status: 400 }
      );
    }

    // Get Spotify credentials from environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Spotify credentials not configured" },
        { status: 500 }
      );
    }

    // Initialize Spotify API
    const spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });

    // Get access token
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body.access_token);
    } catch (error) {
      console.error("Error getting Spotify access token:", error);
      return NextResponse.json(
        { error: "Failed to authenticate with Spotify" },
        { status: 500 }
      );
    }

    // Fetch playlist data
    let playlistData;
    try {
      playlistData = await spotifyApi.getPlaylist(playlistId);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      return NextResponse.json(
        { error: "Failed to fetch playlist data" },
        { status: 500 }
      );
    }

    // Get OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Prepare playlist information for AI analysis
    const playlist = playlistData.body;
    const tracks = playlist.tracks.items
      .filter((item) => item.track !== null)
      .map((item) => ({
        name: item.track!.name,
        artist: item.track!.artists.map((artist) => artist.name).join(", "),
        album: item.track!.album.name,
        albumImage: item.track!.album.images?.[0]?.url || null,
        duration: item.track!.duration_ms,
        popularity: item.track!.popularity,
      }));

    const playlistInfo = {
      name: playlist.name,
      description: playlist.description,
      coverImage: playlist.images?.[0]?.url || null,
      totalTracks: playlist.tracks.total,
      followers: playlist.followers?.total || 0,
      public: playlist.public,
      collaborative: playlist.collaborative,
      tracks: tracks,
    };

    // Call ChatGPT API with playlist data
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a music expert and playlist curator. Analyze the Spotify playlist data provided and give roasting feedback. In the end rate it by some funny metrick 0 to 100, which can be given to playlists in similar genres. Dont mention funny metric in the feedback.`,
          },
          {
            role: "user",
            content: `Please analyze this Spotify playlist and provide feedback under 150 words. Here's the playlist data:

Playlist: ${playlistInfo.name}
Description: ${playlistInfo.description || "No description"}
Total Tracks: ${playlistInfo.totalTracks}
Followers: ${playlistInfo.followers}
Public: ${playlistInfo.public ? "Yes" : "No"}
Collaborative: ${playlistInfo.collaborative ? "Yes" : "No"}

Tracks:
${playlistInfo.tracks
  .map(
    (track, index) =>
      `${index + 1}. ${track.name} - ${track.artist} (${track.album})`
  )
  .join("\n")}

Original URL: ${spotifyUrl}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI feedback" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiFeedback =
      data.choices[0]?.message?.content || "Unable to generate feedback";

    return NextResponse.json({
      feedback: aiFeedback,
      spotifyUrl: spotifyUrl,
      playlistData: playlistInfo,
    });
  } catch (error) {
    console.error("Error processing AI feedback request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
