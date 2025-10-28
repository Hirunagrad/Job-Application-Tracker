import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ApplyForm from "./components/CvForm";
import JobPosts from "./components/JobPosts";

function App() {
  return (
    <>
      <NavBar />
      <div style={{ padding: "3.5rem" }}>
        <Routes>
          <Route path="/" element={<ApplyForm />} />
          <Route path="/create-job" element={<ApplyForm />} />
          <Route path="/job-posts" element={<JobPosts />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
