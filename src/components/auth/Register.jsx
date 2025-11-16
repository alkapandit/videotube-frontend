
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Register() {
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const initialValues = {
    fullname: "",
    email: "",
    username: "",
    password: "",
    phone: "",
  };

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 chars")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone number is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Register Data:", values);
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const res = await axios.post(
        "http://localhost:8000/api/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ User registered successfully!");
      console.log(res.data);
      resetForm();
      if (avatarRef.current) avatarRef.current.value = "";
      if (coverRef.current) coverRef.current.value = "";
      navigate("/login");
    } catch (error) {
      console.error(
        "❌ Registration failed:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {/* Fullname */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Field
                  name="fullname"
                  className="w-full border p-2 rounded focus:outline-blue-500"
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="fullname"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full border p-2 rounded focus:outline-blue-500"
                  placeholder="example@mail.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Field
                  name="phone"
                  className="w-full border p-2 rounded focus:outline-blue-500"
                  placeholder="9876543210"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Avatar
                </label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("avatar", event.currentTarget.files[0])
                  }
                  className="w-full mt-1 text-sm"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("coverImage", event.currentTarget.files[0])
                  }
                  className="w-full mt-1 text-sm"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </button>

              {/* Login Link */}
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 underline">
                  Login here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
