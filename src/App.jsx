import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/index";
import Register from "./components/auth/Register";
import VideoPlayer from "./components/video/VideoPlayer";
import UploadVideo from "./components/video/UploadVideo";
import MyVideos from "./components/video/MyVideos";
import VideoEdit from "./components/video/VideoEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-player/:videoId" element={<VideoPlayer />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/my-videos" element={<MyVideos />} />
        <Route path="/video-edit/:videoId" element={<VideoEdit />} />

        {/* Protected */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Default redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
