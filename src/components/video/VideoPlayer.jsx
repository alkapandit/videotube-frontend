import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import EditUserModal from "../dashboard/UpdateUser";
import Layout from "../common/Layout";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export default function VideoPlayer() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { videoId } = useParams(); // Get video ID from URL params
  console.log("location", location);

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
      const videosList = response?.data?.data?.videos;
      setVideos(videosList);
      
      // Set current video based on URL param or first video
      if (videoId && videosList?.length > 0) {
        const targetVideo = videosList.find(v => v._id === videoId);
        setCurrentVideo(targetVideo || videosList[0]);
      } else if (!currentVideo && videosList?.length > 0) {
        setCurrentVideo(videosList[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching videos");
    } finally {
      setLoading(false);
    }
  }, [location?.state?.token, videoId]);

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
    // Update URL without page reload
    window.history.pushState(null, '', `/video-player/${video._id}`);
  };

  const deleteUsers = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken') || location?.state?.token;
      const response = await axios.patch(
        `${buildApiUrl(API_ENDPOINTS.DELETE_VIDEO)}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response.data);
      fetchVideos();

      // return response.data;
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEditClick = (videos) => {
    setSelectedVideo(videos);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedUser) => {
    setVideos((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading video...</p>
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
      <div className="p-4 lg:p-6 min-h-screen bg-gray-900">
        {/* Mobile Layout - Stack videos vertically */}
        <div className="lg:hidden">
          {currentVideo && (
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6 border border-gray-700">
              <video
                key={currentVideo._id}
                controls
                className="w-full h-48 object-cover"
                poster={currentVideo.thumbnail}
              >
                <source src={currentVideo.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="p-4 bg-gray-800/50 backdrop-blur-sm">
                <h1 className="text-lg font-bold text-white mb-2">
                  {currentVideo.title}
                </h1>
                <p className="text-gray-300 text-sm mb-3">
                  {currentVideo.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">
                    By: {currentVideo.username || 'Unknown'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="text-white bg-blue-600 hover:bg-blue-700 py-1 px-2 rounded text-xs transition-colors"
                      onClick={() => handleEditClick(currentVideo)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-white bg-red-600 hover:bg-red-700 py-1 px-2 rounded text-xs transition-colors"
                      onClick={() => deleteUsers(currentVideo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h2 className="text-lg font-semibold text-white mb-4">Related Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos?.map((video) => (
              <div
                key={video._id}
                className={`bg-gray-700/70 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg p-3 cursor-pointer transition-all hover:shadow-xl hover:border-gray-500 hover:bg-gray-700/90 ${
                  currentVideo?._id === video._id ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <img
                  src={video.thumbnail || "https://via.placeholder.com/300x170/374151/9CA3AF?text=No+Thumbnail"}
                  alt={video.title}
                  className="w-full h-32 rounded object-cover mb-3"
                />
                <h3 className="font-medium text-sm text-white truncate mb-1">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 truncate mb-1">
                  {video.username || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500 overflow-hidden"
                   style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical'
                   }}>
                  {video.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex gap-6">
          {/* Left side - Video Player */}
          <div className="flex-1 lg:flex-2">
            {currentVideo ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                <video
                  key={currentVideo._id}
                  controls
                  className="w-full h-96 object-cover bg-black"
                  poster={currentVideo.thumbnail}
                >
                  <source src={currentVideo.videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Details */}
                <div className="p-4 bg-gray-800/50 backdrop-blur-sm">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {currentVideo.title}
                  </h1>
                  <p className="text-gray-300 text-base mb-3">
                    {currentVideo.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                      By: {currentVideo.username || 'Unknown'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-md text-sm transition-colors"
                        onClick={() => handleEditClick(currentVideo)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-white bg-red-600 hover:bg-red-700 py-1 px-3 rounded-md text-sm transition-colors"
                        onClick={() => deleteUsers(currentVideo._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-gray-400 text-lg">Select a video to play</p>
              </div>
            )}
          </div>

          {/* Right side - Video List */}
          <div className="w-80 xl:w-96">
            <h2 className="text-lg font-semibold text-white mb-4">Related Videos</h2>
            <div className="space-y-3 max-h-screen overflow-y-auto">
              {videos?.map((video) => (
                <div
                  key={video._id}
                  className={`bg-gray-700/70 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg p-3 cursor-pointer transition-all hover:shadow-xl hover:border-gray-500 hover:bg-gray-700/90 ${
                    currentVideo?._id === video._id ? 'ring-2 ring-red-500' : ''
                  }`}
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="flex gap-3">
                    <img
                      src={video.thumbnail || "https://via.placeholder.com/120x68/374151/9CA3AF?text=No+Thumbnail"}
                      alt={video.title}
                      className="w-24 h-14 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-white truncate mb-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-400 truncate mb-1">
                        {video.username || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 overflow-hidden"
                         style={{
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical'
                         }}>
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videos={selectedVideo}
        token={location?.state?.token}
        onUpdate={handleUpdate}
      />
    </Layout>
  );
}
