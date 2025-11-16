import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        buildApiUrl(API_ENDPOINTS.LOGIN),
        {
          username: values.username, // Using username field for email
          password: values.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const accessToken = res.data?.data?.accessToken;
      const refreshToken = res.data?.data?.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      resetForm();
      navigate("/dashboard", {
        state: { token: accessToken },
      });
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setFieldError("password", errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.582 6.186c-.23-1.482-1.438-2.69-2.92-2.92C16.896 3 12 3 12 3s-4.896 0-6.662.266c-1.482.23-2.69 1.438-2.92 2.92C2.152 7.952 2.152 12 2.152 12s0 4.048.266 5.814c.23 1.482 1.438 2.69 2.92 2.92C7.104 21 12 21 12 21s4.896 0 6.662-.266c1.482-.23 2.69-1.438 2.92-2.92.266-1.766.266-5.814.266-5.814s0-4.048-.266-5.814zM9.818 15.592V8.408L15.592 12l-5.774 3.592z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">VideoTube</h1>
            <p className="text-gray-300 text-sm">
              Welcome back to your entertainment hub
            </p>
          </div>

          {/* Login Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Field
                      name="username"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your email or username"
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

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type="password"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your password"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-400">
                      New to VideoTube?
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                  >
                    <span>Create your account</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-75"></div>
      </div>
    </div>
  );
}
