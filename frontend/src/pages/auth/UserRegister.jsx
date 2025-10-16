import React from "react";
import { Link } from "react-router-dom";
import "../styles/shared.css";
import axios from "axios";

const UserRegister = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    await axios.post("http://localhost:3000/api/auth//user/register", {
      fullName: firstName + " " + lastName,
      email: email,
      password: password,
    });
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Create your account</div>
          <div className="auth-desc">
            Register as a user to discover meals near you.
          </div>
        </div>

        <div className="switch-row">
          Switch: <Link to="/user/register">User</Link> ·{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="form-row">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jane"
              />
            </div>

            <div className="form-row">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
              />
            </div>
          </div>

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
              placeholder="Enter a secure password"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Create account
          </button>

          <div>
            <div className="small-note">
              Already have an account?{" "}
              <Link className="muted-link" to="/user/login">
                Sign in
              </Link>
            </div>
          </div>
        </form>

        {/* bottom links removed - use switch-row above the form */}
      </div>
    </div>
  );
};

export default UserRegister;
