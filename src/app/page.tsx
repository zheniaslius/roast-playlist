"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PlaylistData {
  name: string;
  description: string | null;
  coverImage: string | null;
  totalTracks: number;
  followers: number;
  public: boolean;
  collaborative: boolean;
  tracks: Array<{
    name: string;
    artist: string;
    album: string;
    albumImage: string | null;
    duration: number;
    popularity: number;
  }>;
}

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistCoverImage, setPlaylistCoverImage] = useState("");
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [error, setError] = useState("");
  const playlistInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playlistUrl.trim()) {
      setError("Please enter a Spotify playlist URL");
      return;
    }

    if (!playlistUrl.includes("open.spotify.com/playlist/")) {
      setError("Please enter a valid Spotify playlist URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setFeedback("");
    setPlaylistName("");
    setPlaylistCoverImage("");
    setPlaylistData(null);

    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyUrl: playlistUrl.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setPlaylistName(data.playlistData?.name || "");
      setPlaylistCoverImage(data.playlistData?.coverImage || "");
      setPlaylistData(data.playlistData || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze playlist. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
            <img 
              src="/icon.png" 
              alt="Playlist Roaster Icon" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Playlist Roaster
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get AI-powered roasts and brutally honest feedback on your Spotify playlists. 
            Discover what&apos;s wrong with your music taste and get roasted for your questionable choices.
          </p>
        </div>

        {/* Main Form Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Your Playlist Roasted</CardTitle>
              <CardDescription>
                Paste your Spotify playlist link below and prepare for some brutal AI feedback
              </CardDescription>
              <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-700/50">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>
                    <strong>Note:</strong> You can only paste playlists that were not created by Spotify (e.g., no &ldquo;Discover Weekly&rdquo;, &ldquo;Release Radar&rdquo;, or other Spotify-generated playlists).
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-url" className="text-sm font-medium">
                    Spotify Playlist URL
                  </Label>
                  <Input
                    ref={playlistInputRef}
                    id="playlist-url"
                    type="url"
                    placeholder="https://open.spotify.com/playlist/..."
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    className="h-12 text-base"
                    disabled={isLoading}
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Playlist...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Get AI Roast
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {feedback && (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-2 border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-emerald-100/30 dark:from-green-800/20 dark:to-emerald-800/20 opacity-50"></div>
              
              {/* Success indicator */}
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center gap-3 mb-2">  
                  <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-300">
                    Your Playlist Roast
                  </CardTitle>
                </div>
                {playlistName && (
                  <div className="mb-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-green-200 dark:border-green-700/50">
                    <div className="flex items-center gap-4">
                      {playlistCoverImage && (
                        <img 
                          src={playlistCoverImage} 
                          alt={`${playlistName} cover`}
                          className="w-16 h-16 rounded-lg shadow-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          🎵 {playlistName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Playlist being roasted
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-green-600 dark:text-green-400 text-lg">
                  Here&apos;s what AI really thinks about your music taste:
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 border border-green-100 dark:border-green-700/50 shadow-inner">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium">
                      {feedback}
                    </div>
                  </div>
                </div>
                
                {/* Playlist Stats */}
                {playlistData && (
                  <div className="mt-6 bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 border border-green-100 dark:border-green-700/50 shadow-inner">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      📊 Playlist Stats:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-green-100/50 dark:bg-green-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {playlistData.totalTracks}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Tracks
                        </div>
                      </div>
                      <div className="p-3 bg-blue-100/50 dark:bg-blue-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {playlistData.followers.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Followers
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100/50 dark:bg-purple-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {playlistData.public ? "Public" : "Private"}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Status
                        </div>
                      </div>
                      <div className="p-3 bg-orange-100/50 dark:bg-orange-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {playlistData.collaborative ? "Yes" : "No"}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Collaborative
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tracks with album images */}
                {playlistData && playlistData.tracks && (
                  <div className="mt-6 bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 border border-green-100 dark:border-green-700/50 shadow-inner">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🎵 Tracks in this playlist:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {playlistData.tracks.slice(0, 9).map((track, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-green-100 dark:border-green-700/30">
                          {track.albumImage && (
                            <img 
                              src={track.albumImage} 
                              alt={`${track.album} cover`}
                              className="w-12 h-12 rounded-md shadow-sm object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {track.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {track.artist}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                              {track.album}
                            </p>
                          </div>
                        </div>
                      ))}
                      {playlistData.tracks.length > 9 && (
                        <div className="col-span-full text-center text-sm text-gray-600 dark:text-gray-400 py-2">
                          ... and {playlistData.tracks.length - 9} more tracks
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-green-200 dark:border-green-700/50">
                  <Button 
                    onClick={() => {
                      setPlaylistUrl("");
                      setFeedback("");
                      setPlaylistName("");
                      setPlaylistCoverImage("");
                      setPlaylistData(null);
                      playlistInputRef.current?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 h-12"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Roast Another Playlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
