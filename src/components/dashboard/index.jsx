import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchVideos = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken') || location?.state?.token;
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.GET_ALL_VIDEOS), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);
      console.log("data", response?.data);
      setVideos(response?.data?.data?.videos || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching videos");
    } finally {
      setLoading(false);
    }
  }, [location?.state?.token]);

  const handleVideoClick = (video) => {
    // Navigate to video player page
    navigate(`/video-player/${video._id}`);
  };

  const formatDuration = () => {
    // You can implement duration formatting here if available
    return "10:30"; // Placeholder
  };

  const formatViews = () => {
    // You can implement view count formatting here if available
    return "1.2K views"; // Placeholder
  };

  const formatTimeAgo = () => {
    // You can implement time ago formatting here
    return "2 days ago"; // Placeholder
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading videos...</p>
        </div>
      </div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Recommended</h1>
            <p className="text-gray-300">Discover amazing videos from our community</p>
          </div>

          {/* Video Grid */}
          {videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-6xl mb-4">📹</div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">No videos available</h2>
              <p className="text-gray-400">Be the first one to upload a video!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  {/* Video Thumbnail */}
                  <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-3 aspect-video border border-gray-700/50">
                    <img
                      src={video.thumbnail || "https://via.placeholder.com/320x180/374151/9CA3AF?text=No+Thumbnail"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Duration overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {formatDuration()}
                    </div>
                    {/* Play button overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-red-600/90 backdrop-blur-sm rounded-full p-3 shadow-xl">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex gap-3">
                    {/* Channel Avatar */}
                    <div className="shrink-0">
                      <div className="w-9 h-9 bg-linear-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {(video.username || 'U').charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Video Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white leading-snug mb-1 group-hover:text-red-400 transition-colors overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                        {video.title || 'Untitled Video'}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1 hover:text-gray-300 transition-colors">
                        {video.username || 'Unknown Channel'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{formatViews()}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTimeAgo()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
