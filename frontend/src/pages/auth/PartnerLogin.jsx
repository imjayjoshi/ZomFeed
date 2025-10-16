import React from "react";
import "../styles/shared.css";

const PartnerLogin = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Partner sign in</div>
          <div className="auth-desc">
            Access your partner dashboard and manage listings.
          </div>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="owner@example.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Sign in
          </button>
        </form>

        <div className="small-note">
          Need an account?{" "}
          <a className="muted-link" href="/food-partner/register">
            Create partner account
          </a>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
