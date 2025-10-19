import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/reels.css";
import "../../styles/shared.css";
import Reel from "../../components/Reel";

const Home = () => {
  const [reelsData, setReelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchFoodItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/food", {
        withCredentials: true,
      });

      if (response.data && response.data.foodItems) {
        const foodItems = response.data.foodItems.map((item) => ({
          ...item,
          id: item._id,
          likes: item.likeCount || 0,
          comments: 0,
          isLiked: false,
          isSaved: false,
        }));
        setReelsData(foodItems);
      } else {
        setReelsData([]);
      }
    } catch (err) {
      console.error("Error fetching food items:", err);
      // If the backend returns 401, redirect to login so the user can authenticate
      if (err?.response?.status === 401) {
        navigate("/user/login");
        return;
      }
      setError("Failed to load food items");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  const handleLike = async (reelId) => {
    // Optimistically update UI first
    setReelsData((prev) =>
      prev.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked
                ? Math.max(reel.likes - 1, 0)
                : reel.likes + 1,
            }
          : reel
      )
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reelId },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        const isLiked = response.data.message.includes("liked");
        const newLikeCount = response.data.likeCount || 0;

        console.log("Like response:", response.data);
        console.log("Is liked:", isLiked, "New count:", newLikeCount);

        // Update with actual backend data
        setReelsData((prev) =>
          prev.map((reel) =>
            reel.id === reelId
              ? {
                  ...reel,
                  isLiked: isLiked,
                  likes: newLikeCount,
                }
              : reel
          )
        );
      }
    } catch (error) {
      console.error("Error liking food:", error);
      if (error?.response?.status === 401) {
        navigate("/user/login");
        return;
      }
      // Revert optimistic update on error
      setReelsData((prev) =>
        prev.map((reel) =>
          reel.id === reelId
            ? {
                ...reel,
                isLiked: !reel.isLiked,
                likes: reel.isLiked
                  ? Math.max(reel.likes - 1, 0)
                  : reel.likes + 1,
              }
            : reel
        )
      );
    }
  };

  const openStore = (item) => {
    if (!item) return;
    // check for partner id fields
    const partnerId =
      item.foodPartner ||
      item.food_partner ||
      item.partnerId ||
      item.partner_id ||
      item.vendorId ||
      item.vendor_id;
    if (partnerId) {
      // navigate inside the app to partner profile
      navigate(`/partner/${partnerId}`);
      return;
    }

    // fallback: open external link if provided
    const url = item.storeLink || item.store_link || item.store_url;
    if (url && typeof url === "string") {
      // open absolute URLs externally
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        // treat relative links as internal routes
        navigate(url);
      }
    }
  };

  // video URL selection is handled by the Reel component

  const handleSave = async (reelId) => {
    // Optimistically update UI first
    setReelsData((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel
      )
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: reelId },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        const isUnsaved = response.data.message.includes("unsaved");
        const newIsSaved = !isUnsaved;

        // Update state with backend result and persist the full savedReels list
        setReelsData((prev) => {
          const next = prev.map((reel) =>
            reel.id === reelId ? { ...reel, isSaved: newIsSaved } : reel
          );

          try {
            const saved = next
              .filter((r) => r.isSaved)
              .map((r) => ({
                id: r.id,
                description: r.description,
                storeLink: r.storeLink || r.store_link || r.store_url || "#",
              }));
            localStorage.setItem("savedReels", JSON.stringify(saved));
          } catch (err) {
            console.error("Failed to persist savedReels", err);
          }

          return next;
        });
      }
    } catch (error) {
      console.error("Error saving food:", error);
      if (error?.response?.status === 401) {
        navigate("/user/login");
        return;
      }
      // Revert optimistic update on error
      setReelsData((prev) =>
        prev.map((reel) =>
          reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel
        )
      );
    }
  };

  const handleComment = (reelId) => {
    // For now, just show an alert. You can implement a comment modal later
    alert(`Comments for reel ${reelId} - Feature coming soon!`);
  };

  const activeList = reelsData;

  const videoRefs = useRef(new Map());

  useEffect(() => {
    if (!activeList || activeList.length === 0) return;

    const options = { threshold: [0.5] };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (!el || el.tagName !== "VIDEO") return;

        if (entry.intersectionRatio >= 0.5) {
          // play the visible video
          el.play().catch(() => {});
        } else {
          // pause when less than half visible
          if (typeof el.pause === "function") el.pause();
        }
      });
    }, options);

    // observe current video elements
    videoRefs.current.forEach((v) => {
      if (v) observer.observe(v);
    });

    return () => observer.disconnect();
  }, [activeList]);

  if (loading) {
    return (
      <div className="reels-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading delicious content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reels-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchFoodItems}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (reelsData.length === 0) {
    return (
      <div className="reels-container">
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No food reels yet</h3>
          <p>Check back later for delicious content!</p>
        </div>
      </div>
    );
  }

  const listNodes = reelsData.map((r, idx) => {
    const key = r._id ?? r.id ?? idx;
    return (
      <Reel
        key={key}
        reel={r}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComment}
        onOpenStore={openStore}
        videoRefKey={key}
        setVideoRef={(k, el) => {
          if (el) videoRefs.current.set(k, el);
          else videoRefs.current.delete(k);
        }}
        navigate={navigate}
      />
    );
  });

  return <div className="reels-container">{listNodes}</div>;
};

export default Home;
