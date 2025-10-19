import React, { useState, useEffect } from "react";
import "../../styles/partner-profile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/foodpartner/${id}`,
          { withCredentials: true }
        );

        if (!mounted) return;

        const partner = response.data.foodPartner;
        setProfile(partner);
        setVideos(partner?.foodItems || []);
      } catch (err) {
        // handle auth first
        if (err?.response?.status === 401) {
          navigate("/user/login");
          return;
        }

        if (err?.response?.status === 404) {
          setError("Partner not found");
        } else {
          console.warn("Failed to load partner profile:", err?.message || err);
          setError("Failed to load partner profile");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="profile-page">
        <div className="reels-container">
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading partner profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <div className="reels-container">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h2>{error}</h2>
            <p>Check the partner ID or try again later.</p>
            <button onClick={() => navigate(-1)} className="retry-btn">
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business" title="Business name">
              {profile?.name}
            </h1>
            <p className="profile-pill profile-address" title="Address">
              {profile?.address}
            </p>
          </div>
        </div>

        <div className="profile-stats" role="list" aria-label="Stats">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">total meals</span>
            <span className="profile-stat-value">{profile?.totalMeals}</span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">customer served</span>
            <span className="profile-stat-value">
              {profile?.customersServed}
            </span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      <section className="profile-grid" aria-label="Videos">
        {videos.map((v) => (
          <div key={v.id} className="profile-grid-item">
            {/* Placeholder tile; replace with <video> or <img> as needed */}

            <video
              className="profile-grid-video"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={v.video}
              muted
            ></video>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;
