import React from "react";

/**
 * Reel component
 * Props:
 * - reel: object (id, _id, name, description, videoUrl, isLiked, isSaved, likes, comments, storeLink)
 * - onLike(reelId)
 * - onSave(reelId)
 * - onComment(reelId)
 * - onOpenStore(reel)
 * - videoRefKey: unique key for videoRefs map (optional)
 * - setVideoRef: function(key, el) to register video element (optional)
 */
export default function Reel({
  reel,
  onLike,
  onSave,
  onComment,
  onOpenStore,
  videoRefKey,
  setVideoRef,
  navigate,
}) {
  const getVideoUrl = (item) =>
    item.video ||
    item.videoUrl ||
    item.video_url ||
    item.src ||
    item.mediaUrl ||
    null;
  const videoUrl = getVideoUrl(reel);

  return (
    <section className="reel" key={reel._id || reel.id}>
      {videoUrl ? (
        <video
          className="video"
          ref={(el) => {
            if (setVideoRef && videoRefKey !== undefined) {
              if (el) setVideoRef(videoRefKey, el);
              else setVideoRef(videoRefKey, null);
            }
          }}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="poster poster-placeholder">
          <div className="poster-content">
            <div className="poster-icon">🍽️</div>
            <p>Food Content</p>
          </div>
        </div>
      )}

      <div className="reel-gradient" aria-hidden />

      <div className="reel-overlay">
        <div className="reel-content">
          <div className="reel-description">
            <h3 className="reel-title">{reel.name || "Delicious Food"}</h3>
            <p className="reel-text" title={reel.description}>
              {reel.description || "Amazing food content"}
            </p>
          </div>
          <button
            className="visit-store-btn"
            onClick={() => onOpenStore && onOpenStore(reel)}
            aria-label={`Visit store for ${reel.name}`}
          >
            Visit store
          </button>
        </div>
      </div>

      <div className="reel-actions">
        <div className="action-item">
          <button
            className={`action-btn ${reel.isLiked ? "liked" : ""}`}
            onClick={() => onLike && onLike(reel._id ?? reel.id)}
            aria-label="Like"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={reel.isLiked ? "#ff3040" : "none"}
                stroke={reel.isLiked ? "#ff3040" : "#fff"}
                strokeWidth="2"
              />
            </svg>
          </button>
          <span className="action-count">{reel.likes ?? 0}</span>
        </div>

        <div className="action-item">
          <button
            className="action-btn"
            onClick={() => onComment && onComment(reel._id ?? reel.id)}
            aria-label="Comment"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              />
            </svg>
          </button>
          <span className="action-count">{reel.comments ?? 0}</span>
        </div>

        <div className="action-item">
          <button
            className={`action-btn ${reel.isSaved ? "saved" : ""}`}
            onClick={() => onSave && onSave(reel._id ?? reel.id)}
            aria-label="Save"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                fill={reel.isSaved ? "#fff" : "none"}
                stroke={"#fff"}
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bottom-nav">
        <button
          className="nav-btn nav-home"
          onClick={() => navigate && navigate("/")}
        >
          Home
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate && navigate("/saved")}
        >
          Saved
        </button>
      </div>
    </section>
  );
}
