import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Layout from "../common/Layout";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
});

export default function VideoEdit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${buildApiUrl(API_ENDPOINTS.GET_VIDEO_BY_ID)}/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVideo(response.data.data.video);
      setThumbnailPreview(response.data.data.video.thumbnail);
    } catch (err) {
      setError("Failed to fetch video details");
      console.error("Fetch video error:", err);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  const handleThumbnailChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("thumbnail", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus("");
      const token = localStorage.getItem("accessToken");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      // Only append thumbnail if a new one was selected
      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }

      const response = await axios.patch(
        `${buildApiUrl(API_ENDPOINTS.EDIT_VIDEO)}/${videoId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Video updated successfully:", response.data);

      // Show success message and redirect
      alert("Video updated successfully!");
      navigate("/my-videos");
    } catch (error) {
      console.error(
        "❌ Video update failed:",
        error.response?.data || error.message
      );
      setStatus(
        error.response?.data?.message ||
          "Failed to update video. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  // Get video data from state (if navigated from MyVideos) or fetch it
  useEffect(() => {
    if (location.state?.video) {
      setVideo(location.state.video);
      setThumbnailPreview(location.state.video.thumbnail);
    } else {
      fetchVideo();
    }
  }, [videoId, location.state, fetchVideo]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading video details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => navigate("/my-videos")}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Back to My Videos
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <p className="text-gray-400">Video not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => navigate("/my-videos")}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">Edit Video</h1>
            </div>
            <p className="text-gray-300">Update your video details</p>
          </div>

          {/* Edit Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <Formik
              initialValues={{
                title: video?.title || "",
                description: video?.description || "",
                thumbnail: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, status, setFieldValue, values }) => (
                <Form className="space-y-8">
                  {/* Error Display */}
                  {status && (
                    <div className="bg-red-600/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                      {status}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-6">
                      {/* Title Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Video Title *
                        </label>
                        <Field
                          name="title"
                          className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                          placeholder="Enter video title"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      {/* Description Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Description *
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          rows="6"
                          className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none"
                          placeholder="Describe your video..."
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      {/* Thumbnail Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Video Thumbnail (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleThumbnailChange(e, setFieldValue)
                            }
                            className="hidden"
                            id="thumbnail"
                          />
                          <label
                            htmlFor="thumbnail"
                            className="flex items-center justify-center w-full px-4 py-3 border border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-red-500/50 hover:bg-gray-700/30 transition-all duration-200"
                          >
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-gray-300 text-sm">
                                {values.thumbnail
                                  ? "Change thumbnail"
                                  : "Upload new thumbnail"}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="space-y-6">
                      {/* Current/New Thumbnail Preview */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Thumbnail Preview
                        </label>
                        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-700">
                          {thumbnailPreview ? (
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              <div className="text-center">
                                <svg
                                  className="w-12 h-12 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="text-sm">No thumbnail</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                        <h3 className="text-white font-medium">
                          Video Information
                        </h3>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>
                            <span className="text-gray-300">Duration:</span>{" "}
                            {video.duration || "Unknown"}
                          </p>
                          <p>
                            <span className="text-gray-300">Views:</span>{" "}
                            {video.views || 0}
                          </p>
                          <p>
                            <span className="text-gray-300">Created:</span>{" "}
                            {video.createdAt
                              ? new Date(video.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => navigate("/my-videos")}
                      className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isSubmitting
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Video"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
}
