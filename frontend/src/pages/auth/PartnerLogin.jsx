import React from "react";
// styles provided via Tailwind in src/index.css
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post(
      "http://localhost:3000/api/auth/foodpartner/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    navigate("/create-food");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Partner sign in</div>
          <div className="auth-desc">
            Access your partner dashboard and manage listings.
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
