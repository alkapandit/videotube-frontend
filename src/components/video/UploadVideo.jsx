import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../common/Layout';
import { buildApiUrl, API_ENDPOINTS } from '../../utils/apiConfig';

const UploadVideo = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must not exceed 1000 characters'),
    videoFile: Yup.mixed()
      .required('Video file is required')
      .test('fileSize', 'Video file must be less than 100MB', (value) => {
        return value && value.size <= 100 * 1024 * 1024; // 100MB
      })
      .test('fileType', 'Only video files are allowed', (value) => {
        return value && ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'].includes(value.type);
      }),
    thumbnail: Yup.mixed()
      .required('Thumbnail is required')
      .test('fileSize', 'Thumbnail must be less than 5MB', (value) => {
        return value && value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test('fileType', 'Only image files are allowed', (value) => {
        return value && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
      }),
  });

  // Initial form values
  const initialValues = {
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  };

  // Handle file selection
  const handleVideoChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('videoFile', file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const handleThumbnailChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('thumbnail', file);
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('accessToken') || location?.state?.token;
      
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('videoFile', values.videoFile);
      formData.append('thumbnail', values.thumbnail);

      const response = await axios.post(
        buildApiUrl(API_ENDPOINTS.UPLOAD_VIDEO),
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      console.log('Upload successful:', response.data);
      
      // Success notification
      alert('Video uploaded successfully!');
      
      // Redirect to dashboard or video player
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Upload failed:', error);
      
      if (error.response?.data?.message) {
        alert(`Upload failed: ${error.response.data.message}`);
      } else {
        alert('Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
            <p className="text-gray-300">Share your amazing content with the world</p>
          </div>

          {/* Upload Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, isSubmitting }) => (
                <Form className="space-y-8">
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
                          type="text"
                          placeholder="Enter an engaging title for your video"
                          className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="mt-1 text-red-400 text-sm"
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
                          rows={5}
                          placeholder="Describe your video content, what viewers can expect..."
                          className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="mt-1 text-red-400 text-sm"
                        />
                        <p className="mt-1 text-gray-400 text-xs">
                          {values.description.length}/1000 characters
                        </p>
                      </div>

                      {/* Video File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Video File * (Max 100MB)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleVideoChange(e, setFieldValue)}
                            className="hidden"
                            id="video-upload"
                          />
                          <label
                            htmlFor="video-upload"
                            className="flex flex-col items-center justify-center w-full h-32 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="mb-1 text-sm text-gray-400">
                                <span className="font-semibold text-red-400">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">MP4, AVI, MOV, WMV (MAX. 100MB)</p>
                            </div>
                          </label>
                        </div>
                        {values.videoFile && (
                          <p className="mt-2 text-green-400 text-sm">
                            ✓ Selected: {values.videoFile.name}
                          </p>
                        )}
                        <ErrorMessage
                          name="videoFile"
                          component="div"
                          className="mt-1 text-red-400 text-sm"
                        />
                      </div>

                      {/* Thumbnail Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Thumbnail * (Max 5MB)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleThumbnailChange(e, setFieldValue)}
                            className="hidden"
                            id="thumbnail-upload"
                          />
                          <label
                            htmlFor="thumbnail-upload"
                            className="flex flex-col items-center justify-center w-full h-32 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mb-1 text-sm text-gray-400">
                                <span className="font-semibold text-red-400">Click to upload</span> thumbnail
                              </p>
                              <p className="text-xs text-gray-500">JPG, PNG, GIF (MAX. 5MB)</p>
                            </div>
                          </label>
                        </div>
                        {values.thumbnail && (
                          <p className="mt-2 text-green-400 text-sm">
                            ✓ Selected: {values.thumbnail.name}
                          </p>
                        )}
                        <ErrorMessage
                          name="thumbnail"
                          component="div"
                          className="mt-1 text-red-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Right Column - Previews */}
                    <div className="space-y-6">
                      {/* Video Preview */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Video Preview</h3>
                        <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-700">
                          {videoPreview ? (
                            <video
                              src={videoPreview}
                              controls
                              className="w-full h-full object-cover"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-sm">Video preview will appear here</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Thumbnail Preview */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Thumbnail Preview</h3>
                        <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-700">
                          {thumbnailPreview ? (
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-sm">Thumbnail preview will appear here</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Uploading...</span>
                        <span className="text-sm text-gray-300">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="inline-flex items-center px-8 py-3 bg-linear-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Video
                        </>
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
};

export default UploadVideo;
