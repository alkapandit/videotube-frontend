import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Register Data:", values);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("res", res?.data);
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // alert("✅ User Logedin successfully!");
      resetForm();

      navigate("/dashboard", {
        state: { token: res?.data?.data?.accessToken },
      });
    } catch (error) {
      console.error("❌ Login failed:", error.res?.data || error.message);
      alert(error.res?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Field
                name="username"
                className="w-full border p-2 rounded focus:outline-blue-500"
                placeholder="john123"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Field
                name="password"
                type="password"
                className="w-full border p-2 rounded focus:outline-blue-500"
                placeholder="******"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>

            {/* Register Link */}
            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 underline">
                Register here
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
