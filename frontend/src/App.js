import React, { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";
import "./components/AdminDashboard.css";
import { TranslationProvider } from "./contexts/TranslationContext";

import HomePage from "./components/HomePage";
import DeliveryList from "./components/DeliveryList";
import AdminLayout from "./components/AdminLayout";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import DeliveryTracking from "./components/DeliveryTracking";
import NotificationCenter from "./components/NotificationCenter";
import DeliveryDetails from "./components/DeliveryDetails";
import AdminDashboard from "./components/AdminDashboard";
import UsersList from "./components/UsersList";
import OrdersList from "./components/OrdersList";
import DeliveriesAdmin from "./components/DeliveriesAdmin";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("home"); // home, login, register, forgot-password, reset-password, tracking, services, about, pricing, contact
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
  const [viewingDeliveryDetails, setViewingDeliveryDetails] = useState(false);
  // Add a state to directly control which admin view is shown
  const [adminView, setAdminView] = useState(
    window.location.hash.substring(1) || "/admin/dashboard"
  );

  // Update adminView when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setAdminView(window.location.hash.substring(1) || "/admin/dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we have a token in localStorage
      const token = localStorage.getItem("auth_token");

      if (token) {
        // Set the Authorization header with the token
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const response = await api.get("/user");
          setUser(response.data);
          setIsAdmin(response.data.role === "admin");
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token invalid or expired:", error);
          // Clear invalid token
          localStorage.removeItem("auth_token");
          delete api.defaults.headers.common["Authorization"];
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAdmin(userData.role === "admin");
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");

      // Clear auth token from localStorage
      localStorage.removeItem("auth_token");

      // Remove Authorization header from future requests
      delete api.defaults.headers.common["Authorization"];

      // Reset state
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);

      // Even if the API call fails, clear local data
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Show the home page when home mode is selected
    if (authMode === "home") {
      return <HomePage onNavigate={setAuthMode} />;
    }

    // Handle different page states
    if (authMode === "tracking") {
      return (
        <div className="page-container">
          <h1>Package Tracking</h1>
          <p>Track your package in real-time</p>
          <div className="tracking-form">
            <input type="text" placeholder="Enter your tracking number" />
            <button>Track</button>
          </div>
          <button onClick={() => setAuthMode("home")}>Back to Home</button>
        </div>
      );
    }

    if (authMode === "services") {
      return (
        <div className="page-container">
          <h1>Our Services</h1>
          <div className="services-list">
            <div className="service-item">
              <h2>Same Day Delivery</h2>
              <p>
                Get your packages delivered within hours in your local area.
              </p>
            </div>
            <div className="service-item">
              <h2>Standard Delivery</h2>
              <p>
                Affordable and reliable delivery service for regular shipments.
              </p>
            </div>
            <div className="service-item">
              <h2>Express Delivery</h2>
              <p>Priority shipping with guaranteed delivery times.</p>
            </div>
          </div>
          <button onClick={() => setAuthMode("home")}>Back to Home</button>
        </div>
      );
    }

    if (authMode === "about") {
      return (
        <div className="page-container">
          <h1>About Us</h1>
          <p>
            DeliveryApp is a modern delivery service dedicated to providing
            fast, reliable, and secure shipping solutions for individuals and
            businesses.
          </p>
          <p>
            Founded in 2023, we've quickly grown to become a trusted partner for
            thousands of customers across the metropolitan area.
          </p>
          <button onClick={() => setAuthMode("home")}>Back to Home</button>
        </div>
      );
    }

    if (authMode === "pricing") {
      return (
        <div className="page-container">
          <h1>Pricing</h1>
          <div className="pricing-plans">
            <div className="pricing-plan">
              <h2>Standard</h2>
              <p className="price">$5.99</p>
              <ul>
                <li>2-3 business days</li>
                <li>Online tracking</li>
                <li>Email notifications</li>
              </ul>
              <button onClick={() => setAuthMode("login")}>Select</button>
            </div>
            <div className="pricing-plan featured">
              <h2>Express</h2>
              <p className="price">$9.99</p>
              <ul>
                <li>Next-day delivery</li>
                <li>Priority handling</li>
                <li>Real-time tracking</li>
                <li>Delivery notifications</li>
              </ul>
              <button onClick={() => setAuthMode("login")}>Select</button>
            </div>
            <div className="pricing-plan">
              <h2>Premium</h2>
              <p className="price">$14.99</p>
              <ul>
                <li>Same-day delivery</li>
                <li>Dedicated courier</li>
                <li>Real-time tracking</li>
                <li>Proof of delivery</li>
              </ul>
              <button onClick={() => setAuthMode("login")}>Select</button>
            </div>
          </div>
          <button onClick={() => setAuthMode("home")}>Back to Home</button>
        </div>
      );
    }

    if (authMode === "contact") {
      return (
        <div className="page-container">
          <h1>Contact Us</h1>
          <p>We're here to help with any questions about our services.</p>
          <div className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Your message"></textarea>
            </div>
            <button>Send Message</button>
          </div>
          <button onClick={() => setAuthMode("home")}>Back to Home</button>
        </div>
      );
    }

    // Show auth forms when auth mode is selected
    return (
      <div className="app-container">
        {authMode === "login" && (
          <>
            <div className="auth-container">
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
            <div className="auth-toggle">
              <p>
                Don't have an account?{" "}
                <button onClick={() => setAuthMode("register")}>
                  Register
                </button>
              </p>
              <p>
                Forgot your password?{" "}
                <button onClick={() => setAuthMode("forgot-password")}>
                  Reset Password
                </button>
              </p>
              <p>
                Back to home?{" "}
                <button onClick={() => setAuthMode("home")}>Home Page</button>
              </p>
            </div>
          </>
        )}

        {authMode === "register" && (
          <>
            <div className="auth-container">
              <Register onRegisterSuccess={handleLoginSuccess} />
            </div>
            <div className="auth-toggle">
              <p>
                Already have an account?{" "}
                <button onClick={() => setAuthMode("login")}>Login</button>
              </p>
              <p>
                Back to home?{" "}
                <button onClick={() => setAuthMode("home")}>Home Page</button>
              </p>
            </div>
          </>
        )}

        {authMode === "forgot-password" && (
          <>
            <div className="auth-container">
              <ForgotPassword
                onBack={() => setAuthMode("login")}
                onResetRequested={(email, token) => {
                  setResetEmail(email);
                  setResetToken(token);
                  setAuthMode("reset-password");
                }}
              />
            </div>
            <div className="auth-toggle">
              <p>
                Remember your password?{" "}
                <button onClick={() => setAuthMode("login")}>
                  Back to Login
                </button>
              </p>
              <p>
                Back to home?{" "}
                <button onClick={() => setAuthMode("home")}>Home Page</button>
              </p>
            </div>
          </>
        )}

        {authMode === "reset-password" && (
          <>
            <div className="auth-container">
              <ResetPassword
                token={resetToken}
                email={resetEmail}
                onSuccess={() => {
                  setAuthMode("login");
                  alert(
                    "Password has been reset successfully! Please login with your new password."
                  );
                }}
              />
            </div>
            <div className="auth-toggle">
              <p>
                Back to login?{" "}
                <button onClick={() => setAuthMode("login")}>Login Page</button>
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  if (isAdmin) {
    // Determine which admin component to show based on the adminView state
    let adminContent;

    switch (adminView) {
      case "/admin/dashboard":
        adminContent = <AdminDashboard />;
        break;
      case "/admin/deliveries":
        adminContent = <DeliveriesAdmin />;
        break;
      case "/admin/users":
        adminContent = <UsersList />;
        break;
      case "/admin/orders":
        adminContent = <OrdersList />;
        break;
      case "/admin/settings":
        adminContent = (
          <div className="admin-section">
            <h2>System Settings</h2>
            <p>Configure application settings and preferences.</p>
            <div className="settings-form">
              <div className="setting-group">
                <h3>Notification Settings</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked /> Enable email
                    notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked /> Send delivery
                    updates
                  </label>
                </div>
              </div>
              <div className="setting-group">
                <h3>System Preferences</h3>
                <div className="setting-item">
                  <label>Default currency</label>
                  <select defaultValue="USD">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="DH">DH (د.م.)</option>
                  </select>
                </div>
              </div>
              <button className="save-settings-btn">Save Settings</button>
            </div>
          </div>
        );
        break;
      default:
        adminContent = <div>Page not found</div>;
    }

    return (
      <div className="admin-wrapper">
        {isAuthenticated && isAdmin && (
          <AdminLayout
            user={user}
            setAdminView={setAdminView}
            onLogout={handleLogout}
          >
            {adminContent}
          </AdminLayout>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="user-bar">
        <span>Welcome, {user.name}</span>
        <div className="nav-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="app-navigation">
        <button
          className={`nav-btn ${activeSection === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`nav-btn ${
            activeSection === "deliveries" ? "active" : ""
          }`}
          onClick={() => setActiveSection("deliveries")}
        >
          My Deliveries
        </button>
        <button
          className={`nav-btn ${activeSection === "profile" ? "active" : ""}`}
          onClick={() => setActiveSection("profile")}
        >
          My Profile
        </button>
      </div>

      {activeSection === "dashboard" && <Dashboard />}

      {activeSection === "deliveries" && !viewingDeliveryDetails && (
        <div className="main-content">
          <DeliveryList
            onViewDetails={(deliveryId) => {
              setSelectedDeliveryId(deliveryId);
              setViewingDeliveryDetails(true);
            }}
          />
        </div>
      )}

      {activeSection === "deliveries" && viewingDeliveryDetails && (
        <DeliveryDetails
          deliveryId={selectedDeliveryId}
          onBack={() => setViewingDeliveryDetails(false)}
        />
      )}

      {activeSection === "profile" && <Profile />}
    </div>
  );
}

// Wrap the entire application with the TranslationProvider
function AppWithTranslation() {
  return (
    <TranslationProvider>
      <App />
    </TranslationProvider>
  );
}

export default AppWithTranslation;
