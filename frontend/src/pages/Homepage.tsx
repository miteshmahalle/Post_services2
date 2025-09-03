import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";

// Import logo from public folder or use placeholder
const logoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/India_Post.svg/200px-India_Post.svg.png";

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to login page
    navigate("/login");
  };

  const handleRegister = () => {
    // Keep existing behavior as requested
    window.location.href = "/register";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="homepage-header">
        {/* Logo and India Post Text */}
        <div className="header-logo-section">
          <img src={logoUrl} alt="India Post Logo" className="header-logo" />
          <div className="header-logo-text">
            <h2>भारतीय डाक</h2>
            <p>India Post</p>
          </div>
        </div>

        {/* Center Title */}
        <div className="header-title-section">
          <h1>BRSR Report for Postal Services</h1>
          <p>Government of India • Department of Posts</p>
        </div>

        {/* Auth Buttons */}
        <div className="header-auth-buttons">
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="navigation-menu">
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#about">About Us</a>
          </li>
          <li>
            <a href="#contact">Contact Us</a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Digital BRSR Reporting Platform</h1>
            <p>
              Streamlined Business Responsibility and Sustainability Reporting
              for India Post branches nationwide
            </p>
            <div className="hero-buttons">
              <button className="cta-primary" onClick={handleLogin}>
                Get Started
              </button>
              <button className="cta-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            {/* 3D Postman Service Illustration */}
            <div className="postman-illustration">
              <div className="post-office">
                <div className="building"></div>
                <div className="sign">POST OFFICE</div>
              </div>
              <div className="postman">
                <div className="postman-body"></div>
                <div className="postman-bag"></div>
              </div>
              <div className="delivery-truck">
                <div className="truck-body"></div>
                <div className="truck-wheels"></div>
              </div>
              <div className="mail-packages">
                <div className="package package1"></div>
                <div className="package package2"></div>
                <div className="package package3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>ESG Reporting</h3>
              <p>
                Comprehensive Environmental, Social, and Governance reporting
                tools for all postal branches.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">📈</div>
              <h3>Data Analytics</h3>
              <p>
                Advanced analytics and insights to track sustainability metrics
                and performance indicators.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>
                Government-grade security ensuring data privacy and compliance
                with regulatory standards.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>Mobile Access</h3>
              <p>
                Access your reports and submit data from anywhere with our
                responsive mobile platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Platform</h2>
              <p>
                The BRSR Reporting Platform is a comprehensive digital solution
                designed specifically for India Post to streamline Business
                Responsibility and Sustainability Reporting across all branches
                and divisions.
              </p>

              <div className="features-list">
                <h3>Key Features:</h3>
                <ul>
                  <li>
                    ✅ <strong>Multi-level Access:</strong> Branch, Division,
                    and Circle level dashboards
                  </li>
                  <li>
                    ✅ <strong>Real-time Monitoring:</strong> Track energy
                    consumption, waste management, and training hours
                  </li>
                  <li>
                    ✅ <strong>Automated Reporting:</strong> Generate
                    comprehensive BRSR reports automatically
                  </li>
                  <li>
                    ✅ <strong>Data Validation:</strong> Ensure accuracy with
                    built-in validation checks
                  </li>
                  <li>
                    ✅ <strong>Compliance Management:</strong> Stay updated with
                    latest regulatory requirements
                  </li>
                  <li>
                    ✅ <strong>Performance Analytics:</strong> Visual insights
                    and trend analysis
                  </li>
                </ul>
              </div>

              <div className="stats">
                <div className="stat">
                  <h4>1000+</h4>
                  <p>Postal Branches</p>
                </div>
                <div className="stat">
                  <h4>50+</h4>
                  <p>Divisions</p>
                </div>
                <div className="stat">
                  <h4>24/7</h4>
                  <p>System Availability</p>
                </div>
              </div>
            </div>

            <div className="about-image">
              <div className="sustainability-visual">
                <div className="earth-icon">🌍</div>
                <div className="connecting-lines">
                  <div className="line line1"></div>
                  <div className="line line2"></div>
                  <div className="line line3"></div>
                </div>
                <div className="feature-nodes">
                  <div className="node node1">📊</div>
                  <div className="node node2">🔋</div>
                  <div className="node node3">♻️</div>
                  <div className="node node4">📈</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">🏢</div>
                <div>
                  <h4>Head Office</h4>
                  <p>
                    Department of Posts
                    <br />
                    Ministry of Communications
                    <br />
                    Government of India
                    <br />
                    New Delhi - 110001
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>
                    +91-11-23096100
                    <br />
                    Toll Free: 1800-266-6868
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>
                    brsr.support@indiapost.gov.in
                    <br />
                    sustainability@indiapost.gov.in
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <div>
                  <h4>Website</h4>
                  <p>
                    www.indiapost.gov.in
                    <br />
                    www.postalservices.gov.in
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3>Send us a Message</h3>
              <div className="form-container" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows={5} required></textarea>
                </div>
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmit}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src={logoUrl} alt="India Post Logo" />
                <div>
                  <h4>भारतीय डाक</h4>
                  <p>India Post</p>
                </div>
              </div>
              <p>
                Connecting India through sustainable postal services and digital
                innovation.
              </p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="#">BRSR Reporting</a>
                </li>
                <li>
                  <a href="#">ESG Analytics</a>
                </li>
                <li>
                  <a href="#">Compliance Management</a>
                </li>
                <li>
                  <a href="#">Performance Monitoring</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Government Links</h4>
              <ul>
                <li>
                  <a
                    href="https://www.indiapost.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    India Post
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.digitalindia.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Digital India
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mygov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MyGov
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.india.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    India Portal
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>
                &copy; {new Date().getFullYear()} India Post. All rights
                reserved. | Department of Posts, Government of India
              </p>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Accessibility</a>
                <a href="#">RTI</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
