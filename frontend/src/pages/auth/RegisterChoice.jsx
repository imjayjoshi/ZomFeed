import React from "react";


const RegisterChoice = () => {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-header">
          <div className="auth-title">Get started</div>
          <div className="auth-desc">
            Choose how you'd like to register on ZomFeed.
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
          <a
            className="btn btn-primary"
            href="/user/register"
            style={{ textDecoration: "none" }}
          >
            Register as normal user
          </a>

          <a
            className="btn"
            href="/food-partner/register"
            style={{
              border: "1px solid rgba(15,23,42,0.12)",
              textDecoration: "none",
            }}
          >
            Register as food partner
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
