import React from "react";
import "../styles/shared.css";

const UserLogin = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Welcome back</div>
          <div className="auth-desc">Sign in to continue to ZomFeed.</div>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
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
          New here?{" "}
          <a className="muted-link" href="/user/register">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
