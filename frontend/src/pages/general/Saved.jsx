import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/reels.css";
import "../../styles/shared.css";
import Reel from "../../components/Reel";

export default function Saved() {
  const [reels, setReels] = useState([]);
  const navigate = useNavigate();

  const [loadError, setLoadError] = useState(null);

  const fetchSaved = useCallback(async () => {
    setLoadError(null);

    try {
      const res = await axios.get("http://localhost:3000/api/food/save", {
        withCredentials: true,
      });
      const savedFood = (res.data.savedFood || []).map((item) => ({
        id: item._id,
        description: item.description || "",
        storeLink: item.foodPartner || item.store_link || item.storeUrl || "#",
        videoUrl: item.video || null,
        isSaved: true,
      }));
      setReels(savedFood);
      // persist minimal keys so Saved page can fall back to cache
      try {
        persistMinimal(savedFood);
      } catch {
        /* ignore persistence errors */
      }
      setLoadError(null);
    } catch (err) {
      console.warn(
        "Failed to load saved reels from server:",
        err?.message || err
      );

      if (err?.response?.status === 401) {
        navigate("/user/login");
        return;
      }

      // Fallback to localStorage cache
      try {
        const raw = localStorage.getItem("savedReels") || "[]";
        const minimal = JSON.parse(raw);
        if (Array.isArray(minimal) && minimal.length > 0) {
          const mapped = minimal.map((item) => ({
            id: item.id,
            description: item.description || "",
            storeLink:
              item.storeLink || item.store_link || item.storeUrl || "#",
            videoUrl: item.videoUrl || item.video || null,
            isSaved: true,
          }));
          setReels(mapped);
          setLoadError(
            "Failed to load from server — showing cached saved reels"
          );
          return;
        }
      } catch (e) {
        console.warn(
          "Failed to read savedReels from localStorage:",
          e?.message || e
        );
      }

      setReels([]);
      setLoadError("Failed to load saved reels from server");
    }
  }, [navigate]);

  useEffect(() => {
    // call fetchSaved; no need for cancelled here because fetchSaved is safe
    fetchSaved();
  }, [fetchSaved]);

  const persistMinimal = (list) => {
    try {
      const minimal = list.map((r) => ({
        id: r.id,
        description: r.description,
        storeLink: r.storeLink || "#",
      }));
      localStorage.setItem("savedReels", JSON.stringify(minimal));
    } catch (err) {
      console.error("Failed to persist savedReels", err);
    }
  };

  const handleSave = async (reelId) => {
    setReels((prev) => prev.filter((r) => r.id !== reelId));
    try {
      await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: reelId },
        { withCredentials: true }
      );
      const fresh = await axios.get("http://localhost:3000/api/food/save", {
        withCredentials: true,
      });
      const savedFood = (fresh.data.savedFood || []).map((item) => ({
        id: item._id,
        description: item.description || "",
        storeLink: item.storeLink || item.store_link || item.storeUrl || "#",
        videoUrl: item.videoUrl || item.video || null,
        isSaved: true,
      }));
      setReels(savedFood);
      persistMinimal(savedFood);
    } catch (err) {
      console.error("Error saving/unsaving saved reel:", err);
      if (err?.response?.status === 401) {
        navigate("/user/login");
        return;
      }
      try {
        const fresh = await axios.get("http://localhost:3000/api/food/save", {
          withCredentials: true,
        });
        const savedFood = (fresh.data.savedFood || []).map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          videoUrl: item.videoUrl,
          likes: item.likeCount ?? 0,
          comments: item.commentCount ?? 0,
          storeLink: item.storeLink,
          isLiked: item.isLiked ?? false,
          isSaved: true,
        }));
        setReels(savedFood);
        persistMinimal(savedFood);
      } catch (err2) {
        console.error("Failed to reload saved reels after error", err2);
        if (err?.response?.status === 401) {
          navigate("/user/login");
          return;
        }
      }
    }
  };

  const handleLike = async (reelId) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isLiked: !r.isLiked,
              likes: r.isLiked
                ? Math.max((r.likes || 1) - 1, 0)
                : (r.likes || 0) + 1,
            }
          : r
      )
    );
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reelId },
        { withCredentials: true }
      );
      if (res.status === 200 || res.status === 201) {
        const isLiked = res.data.message?.includes("liked");
        const newCount = res.data.likeCount ?? 0;
        setReels((prev) =>
          prev.map((r) =>
            r.id === reelId ? { ...r, isLiked: !!isLiked, likes: newCount } : r
          )
        );
      }
    } catch (err) {
      console.error("Error liking saved reel:", err);
      setReels((prev) =>
        prev.map((r) => (r.id === reelId ? { ...r, isLiked: !r.isLiked } : r))
      );
    }
  };

  const handleComment = (reelId) => {
    alert(`Comments for saved reel ${reelId} - Feature coming soon!`);
  };

  const openStore = (item) => {
    if (!item) return;
    const partnerId =
      item.partnerId ||
      item.partner_id ||
      item.vendorId ||
      item.vendor_id ||
      item._id ||
      item.id;
    if (partnerId) {
      navigate(`/partner/${partnerId}`);
      return;
    }
    const url =
      item.storeLink || item.store_link || item.store_url || item.storeUrl;
    if (url && typeof url === "string") {
      if (url.startsWith("http://") || url.startsWith("https://"))
        window.open(url, "_blank", "noopener,noreferrer");
      else navigate(url);
    }
  };

  // video URL selection is handled by the Reel component

  if (!reels || reels.length === 0) {
    return (
      <div className="root-reels-setup">
        <div className="reels-container">
          {loadError && (
            <div className="error-banner">
              <p>{loadError}</p>
              <button className="retry-btn" onClick={() => fetchSaved()}>
                Retry
              </button>
            </div>
          )}
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h2>No Saved Reels</h2>
            <p>Save reels you like to see them here</p>
            <button className="retry-btn" onClick={() => navigate("/")}>
              Browse Reels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="root-reels-setup">
      <div className="reels-container">
        {loadError && (
          <div className="error-banner">
            <p>{loadError}</p>
            <button className="retry-btn" onClick={() => fetchSaved()}>
              Retry
            </button>
          </div>
        )}
        {reels.map((reel, idx) => (
          <Reel
            key={reel.id ?? reel._id ?? idx}
            reel={reel}
            onLike={handleLike}
            onSave={handleSave}
            onComment={handleComment}
            onOpenStore={openStore}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
}
