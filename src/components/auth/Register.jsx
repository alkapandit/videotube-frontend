import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    avatar: null,
    coverImage: null,
  });

  const initialValues = {
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  };

  const validationSchema = Yup.object({
    fullname: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
      .required("Full name is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      // .min(8, "Password must be at least 8 characters")
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      //   "Password must contain uppercase, lowercase and number"
      // )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    avatar: Yup.mixed()
      .required("Profile picture is required")
      .test("fileSize", "File size too large (max 5MB)", (value) => {
        return !value || value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          !value ||
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            value.type
          )
        );
      }),
    coverImage: Yup.mixed()
      .test("fileSize", "File size too large (max 10MB)", (value) => {
        return !value || value.size <= 10 * 1024 * 1024;
      })
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          !value ||
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            value.type
          )
        );
      }),
  });

  const handleFileChange = (event, fieldName, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue(fieldName, file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [fieldName]: previewUrl,
      }));
    }
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", values.fullname);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      if (values.coverImage) {
        formData.append("coverImage", values.coverImage);
      }

      const res = await axios.post(
        buildApiUrl(API_ENDPOINTS.REGISTER),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      resetForm();
      setPreviewImages({ avatar: null, coverImage: null });

      // Auto login after successful registration
      if (res.data?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);
        navigate("/dashboard");
      } else {
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      }
    } catch (error) {
      console.error(
        "❌ Registration failed:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      // Set field-specific errors if available
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          setFieldError(field, errors[field]);
        });
      } else {
        setFieldError("email", errorMessage);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-lg">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.582 6.186c-.23-1.482-1.438-2.69-2.92-2.92C16.896 3 12 3 12 3s-4.896 0-6.662.266c-1.482.23-2.69 1.438-2.92 2.92C2.152 7.952 2.152 12 2.152 12s0 4.048.266 5.814c.23 1.482 1.438 2.69 2.92 2.92C7.104 21 12 21 12 21s4.896 0 6.662-.266c1.482-.23 2.69-1.438 2.92-2.92.266-1.766.266-5.814.266-5.814s0-4.048-.266-5.814zM9.818 15.592V8.408L15.592 12l-5.774 3.592z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join VideoTube
            </h1>
            <p className="text-gray-300 text-sm">
              Create your account and start sharing
            </p>
          </div>

          {/* Register Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <Field
                      name="fullname"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="fullname"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Username
                  </label>
                  <div className="relative">
                    <Field
                      name="username"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Choose a unique username"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <Field
                      name="email"
                      type="email"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Field
                      name="phone"
                      type="tel"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your 10-digit phone number"
                      maxLength="10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type="password"
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                        placeholder="Create password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type="password"
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                        placeholder="Confirm password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Profile Images
                  </h3>

                  {/* Avatar Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Profile Picture <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleFileChange(event, "avatar", setFieldValue)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-purple-500/50 transition-all duration-200">
                        <div className="text-center">
                          {previewImages.avatar ? (
                            <img
                              src={previewImages.avatar}
                              alt="Avatar preview"
                              className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                            />
                          ) : (
                            <svg
                              className="w-12 h-12 text-gray-400 mx-auto mb-2"
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
                          )}
                          <p className="text-sm text-gray-300">
                            Click to upload profile picture
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, WEBP (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage
                      name="avatar"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Cover Image{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleFileChange(event, "coverImage", setFieldValue)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center w-full h-24 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-purple-500/50 transition-all duration-200">
                        <div className="text-center">
                          {previewImages.coverImage ? (
                            <img
                              src={previewImages.coverImage}
                              alt="Cover preview"
                              className="w-16 h-10 rounded mx-auto mb-2 object-cover"
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 text-gray-400 mx-auto mb-1"
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
                          )}
                          <p className="text-xs text-gray-300">
                            Click to upload cover image
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, WEBP (max 10MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage
                      name="coverImage"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-400">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                  >
                    <svg
                      className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
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
                    <span>Sign in to your account</span>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-75"></div>
      </div>
    </div>
  );
}
