import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("video", videoFile);
    formData.append("name", name);
    formData.append("description", description);

    const response = await axios
      .post("http://localhost:3000/api/food", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Upload successful:", response.data);
        alert("Upload successful!");
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        alert("Upload failed.");
      });

    console.log(response);
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h2 className="auth-title">Create Reel</h2>
          <p className="auth-desc">
            Upload a short video, give it a name and a short description.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="video">Video</label>

            {/* Styled dropzone */}
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  document.getElementById("video-input").click();
                }
              }}
              onClick={() => document.getElementById("video-input").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files && e.dataTransfer.files[0];
                if (file) setVideoFile(file);
              }}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                borderRadius: 8,
                border: "1px dashed rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.01)",
                cursor: "pointer",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3v10"
                  stroke="#e6eef8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7l4-4 4 4"
                  stroke="#e6eef8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="3"
                  y="13"
                  width="18"
                  height="8"
                  rx="2"
                  stroke="#e6eef8"
                  strokeWidth="1.2"
                />
              </svg>

              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, color: "#e6eef8" }}>
                  Click or drag video here
                </div>
                <div style={{ color: "#9aa8bf", fontSize: 13 }}>
                  MP4/WEBM — under 100MB recommended
                </div>
              </div>

              <input
                id="video-input"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {previewUrl && (
            <div className="form-row">
              <label>Preview</label>
              <div
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <video
                  className="poster"
                  src={previewUrl}
                  controls
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          )}

          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter video title"
            />
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Short description (max 200 chars)"
              style={{
                padding: "0.65rem 0.75rem",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "#e6eef8",
                outline: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <small className="small-note">{description.length}/200</small>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
