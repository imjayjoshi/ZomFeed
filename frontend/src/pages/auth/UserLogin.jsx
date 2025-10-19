import React from "react";
// styles provided via Tailwind in src/index.css
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post(
      "http://localhost:3000/api/auth/user/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    navigate("/");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Welcome back</div>
          <div className="auth-desc">Sign in to continue to ZomFeed.</div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
