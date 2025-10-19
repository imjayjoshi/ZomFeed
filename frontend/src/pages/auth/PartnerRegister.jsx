import React from "react";
import { Link } from "react-router-dom";
// styles provided via Tailwind in src/index.css
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    const response = await axios.post(
      "http://localhost:3000/api/auth/foodpartner/register",
      {
        name: firstName + " " + lastName,
        businessName: businessName,
        contactName: contactName,
        phone: phone,
        email: email,
        password: password,
        address: address,
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
          <div className="auth-title">Partner sign up</div>
          <div className="auth-desc">
            Register your kitchen or restaurant to start listing meals.
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
                placeholder="Alex"
              />
            </div>

            <div className="form-row">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Owner"
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="businessName">Business name</label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Tasty Bites"
            />
          </div>

          <div className="name-row">
            <div className="form-row">
              <label htmlFor="contactName">Contact name</label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                placeholder="Jane Doe"
              />
            </div>

            <div className="form-row">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="business@example.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create password"
            />
          </div>

          <div className="form-row">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="123 Market Street"
            />
          </div>

          <div className="small-note">
            Full address helps customers find you faster.
          </div>

          <button className="btn btn-primary" type="submit">
            Create Partner Account
          </button>

          <div>
            <div className="small-note">
              Already have an account?{" "}
              <Link className="muted-link" to="/food-partner/login">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerRegister;
