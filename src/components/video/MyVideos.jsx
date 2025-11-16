import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchMyVideos = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken') || location?.state?.token;
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.GET_MY_UPLOADS), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("My videos response", response);
      setVideos(response?.data?.data?.videos || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching your videos");
    } finally {
      setLoading(false);
    }
  }, [location?.state?.token]);

  const handleVideoClick = (video) => {
    // Navigate to video player page
    navigate(`/video-player/${video._id}`);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken') || location?.state?.token;
      await axios.delete(
        `${buildApiUrl(API_ENDPOINTS.DELETE_VIDEO)}/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Remove video from local state
      setVideos(videos.filter(video => video._id !== videoId));
      setActiveDropdown(null);
      
      // Show success message
      alert('Video deleted successfully');
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete video");
    }
  };

  const handleUpdateVideo = (video) => {
    // Navigate to update/edit page (you can create this later)
    navigate(`/video-edit/${video._id}`, { state: { video } });
    setActiveDropdown(null);
  };

  const toggleDropdown = (videoId, event) => {
    event.stopPropagation(); // Prevent video click
    setActiveDropdown(activeDropdown === videoId ? null : videoId);
  };

  const formatDuration = () => {
    return "10:30"; // Placeholder
  };

  const formatViews = () => {
    return "1.2K views"; // Placeholder
  };

  const formatTimeAgo = (createdAt) => {
    if (!createdAt) return "Recently";
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  useEffect(() => {
    fetchMyVideos();
  }, [fetchMyVideos]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your videos...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">My Videos</h1>
                <p className="text-gray-300">Manage your uploaded videos</p>
              </div>
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Upload New Video</span>
              </button>
            </div>
          </div>

          {/* Video Grid */}
          {videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-6xl mb-4">📹</div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">No videos uploaded yet</h2>
              <p className="text-gray-400 mb-6">Start sharing your content with the world!</p>
              <button
                onClick={() => navigate('/upload-video')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="cursor-pointer group relative"
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
                      <div className="flex items-start justify-between">
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
                            {video.username || 'You'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{formatViews()}</span>
                            <span className="mx-1">•</span>
                            <span>{formatTimeAgo(video.createdAt)}</span>
                          </div>
                        </div>
                        
                        {/* Three dots menu */}
                        <div className="relative ml-2">
                          <button
                            onClick={(e) => toggleDropdown(video._id, e)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdown === video._id && (
                            <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[120px] overflow-visible">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateVideo(video);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center space-x-2 first:rounded-t-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                              <hr className="border-gray-700" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVideo(video._id);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors duration-150 flex items-center space-x-2 last:rounded-b-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
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
