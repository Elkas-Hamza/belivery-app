import React from "react";
import {
  FiTruck,
  FiPackage,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiPhoneCall,
} from "react-icons/fi";
import { useTranslation } from "../contexts/TranslationContext";
import "./HomePage.css";

const HomePage = ({ onNavigate }) => {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <FiTruck className="hero-logo-icon" />
            <h1>DeliveryApp</h1>
          </div>
          <h2>{t.home.hero.title}</h2>
          <p className="hero-tagline">{t.home.hero.tagline}</p>
          <p className="hero-description">{t.home.hero.description}</p>
          <div className="hero-buttons">
            <button
              onClick={() => onNavigate("login")}
              className="hero-button primary-button"
            >
              {t.home.hero.getQuote}
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="hero-button secondary-button"
            >
              {t.home.hero.learnMore}
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">15k+</span>
              <span className="stat-label">{t.home.stats.deliveries}</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">{t.home.stats.onTime}</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">{t.home.stats.support}</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="hero-image.jpg"
            alt="Happy delivery man with package"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <h2>{t.home.services.title}</h2>
          <p>{t.home.services.subtitle}</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-badge">
              {t.home.services.express.popular}
            </div>
            <div className="service-image">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Express Delivery"
              />
            </div>
            <div className="service-icon">
              <FiTruck className="service-icon" />
            </div>
            <h3>{t.home.services.express.title}</h3>
            <p className="service-description">
              {t.home.services.express.description}
            </p>
            <ul className="service-features">
              {t.home.services.express.features.map((feature, index) => (
                <li key={index}>
                  <FiCheckCircle /> {feature}
                </li>
              ))}
            </ul>
            <div className="service-price">
              <span className="price-from">
                {t.home.services.express.price}
              </span>
              <span className="price-amount">99.99 DH</span>
            </div>
            <button className="service-button">
              {t.home.services.express.select}
            </button>
          </div>
          <div className="service-card featured">
            <div className="service-image">
              <img
                src="https://imgs.search.brave.com/RrBD5VIn4MwEFbGJECG_ahJc5PLFpfxdvJHIvuYQmi8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA3/NDk0MjA3NC9waG90/by9kZWxpdmVyeS1t/YW4uanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPUFUdkZXNGVn/SEtVVU1VTFpDaHNQ/eE1UVnlwRlVPSWYw/bExnWDlGOE1xNTQ9"
              />
            </div>
            <div className="service-icon">
              <FiPackage className="service-icon" />
            </div>
            <h3>{t.home.services.standard.title}</h3>
            <p className="service-description">
              {t.home.services.standard.description}
            </p>
            <ul className="service-features">
              {t.home.services.standard.features.map((feature, index) => (
                <li key={index}>
                  <FiCheckCircle /> {feature}
                </li>
              ))}
            </ul>
            <div className="service-price">
              <span className="price-from">
                {t.home.services.standard.price}
              </span>
              <span className="price-amount">49.99 DH</span>
            </div>
            <button className="service-button">
              {t.home.services.standard.quote}
            </button>
          </div>
          <div className="service-card">
            <div className="service-image">
              <img
                src="https://media.istockphoto.com/id/1377893181/photo/shot-of-young-man-delivering-a-package-while-sitting-in-a-vehicle.jpg?s=612x612&w=0&k=20&c=yOMqI9TcSFRPKuLl40lUsjYmRkji9hoH_eUtKPUrZwk="
                alt="Delivery person in vehicle"
              />
            </div>
            <div className="service-icon">
              <FiClock className="service-icon" />
            </div>
            <h3>{t.home.services.economy.title}</h3>
            <p className="service-description">
              {t.home.services.economy.description}
            </p>
            <ul className="service-features">
              {t.home.services.economy.features.map((feature, index) => (
                <li key={index}>
                  <FiCheckCircle /> {feature}
                </li>
              ))}
            </ul>
            <div className="service-price">
              <span className="price-from">
                {t.home.services.economy.price}
              </span>
              <span className="price-amount">29.99 DH</span>
            </div>
            <button className="service-button">
              {t.home.services.economy.select}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>{t.home.features.title}</h2>
          <p>{t.home.features.subtitle}</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiClock />
            </div>
            <h3>{t.home.features.timely.title}</h3>
            <p>{t.home.features.timely.description}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiMapPin />
            </div>
            <h3>{t.home.features.coverage.title}</h3>
            <p>{t.home.features.coverage.description}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiPackage />
            </div>
            <h3>{t.home.features.secure.title}</h3>
            <p>{t.home.features.secure.description}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiCheckCircle />
            </div>
            <h3>{t.home.features.satisfaction.title}</h3>
            <p>{t.home.features.satisfaction.description}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>{t.home.process.title}</h2>
          <p>{t.home.process.subtitle}</p>
        </div>
        <div className="process-container">
          <div className="process-timeline">
            <div className="timeline-line"></div>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-icon-container">
                <div className="step-icon">
                  <FiPackage />
                </div>
                <div className="step-number">1</div>
              </div>
              <div className="step-content">
                <h3>{t.home.process.book.title}</h3>
                <p>{t.home.process.book.description}</p>
                <button
                  onClick={() => onNavigate("login")}
                  className="step-link"
                >
                  {t.home.process.book.button}
                </button>
              </div>
            </div>

            <div className="process-step">
              <div className="step-icon-container">
                <div className="step-icon">
                  <FiTruck />
                </div>
                <div className="step-number">2</div>
              </div>
              <div className="step-content">
                <h3>{t.home.process.pickup.title}</h3>
                <p>{t.home.process.pickup.description}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-icon-container">
                <div className="step-icon">
                  <FiMapPin />
                </div>
                <div className="step-number">3</div>
              </div>
              <div className="step-content">
                <h3>{t.home.process.tracking.title}</h3>
                <p>{t.home.process.tracking.description}</p>
                <button
                  onClick={() => onNavigate("tracking")}
                  className="step-link"
                >
                  {t.home.process.tracking.button}
                </button>
              </div>
            </div>

            <div className="process-step">
              <div className="step-icon-container">
                <div className="step-icon">
                  <FiCheckCircle />
                </div>
                <div className="step-number">4</div>
              </div>
              <div className="step-content">
                <h3>{t.home.process.delivery.title}</h3>
                <p>{t.home.process.delivery.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="coverage-section">
        <div className="section-header">
          <h2>{t.home.coverage.title}</h2>
          <p>{t.home.coverage.subtitle}</p>
        </div>
        <div className="service-area-container">
          <div className="service-map">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Service area map"
            />
          </div>
          <div className="service-zones">
            <div className="zone-card">
              <div className="zone-marker zone-a">A</div>
              <div className="zone-details">
                <h3>{t.home.coverage.zones.a.title}</h3>
                <p className="express">{t.home.coverage.zones.a.express}</p>
                <p className="standard">{t.home.coverage.zones.a.standard}</p>
              </div>
            </div>
            <div className="zone-card">
              <div className="zone-marker zone-b">B</div>
              <div className="zone-details">
                <h3>{t.home.coverage.zones.b.title}</h3>
                <p className="express">{t.home.coverage.zones.b.express}</p>
                <p className="standard">{t.home.coverage.zones.b.standard}</p>
              </div>
            </div>
            <div className="zone-card">
              <div className="zone-marker zone-c">C</div>
              <div className="zone-details">
                <h3>{t.home.coverage.zones.c.title}</h3>
                <p className="express">{t.home.coverage.zones.c.express}</p>
                <p className="standard">{t.home.coverage.zones.c.standard}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>{t.home.testimonials.title}</h2>
          <p>{t.home.testimonials.subtitle}</p>
          <div className="section-badge">{t.home.testimonials.featured}</div>
        </div>
        <div className="testimonials-carousel">
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="testimonial-content">
                <p>
                  "DeliveryApp has revolutionized our e-commerce business. Their
                  API integration and reliable same-day delivery have increased
                  our customer satisfaction by 45%. The real-time tracking is a
                  game-changer for our support team."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt="Sarah Johnson"
                  />
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>E-Commerce Director</p>
                  <div className="company-logo">
                    <img
                      src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="StyleShop logo"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card featured">
              <div className="testimonial-badge">Featured</div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="testimonial-content">
                <p>
                  "We've partnered with DeliveryApp for all our metropolitan
                  deliveries for the past 2 years. Their professional drivers,
                  competitive rates, and exceptional customer service have made
                  them an invaluable part of our logistics strategy."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt="Michael Chen"
                  />
                </div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <p>Operations Manager</p>
                  <div className="company-logo">
                    <img
                      src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="TechCorp logo"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="testimonial-content">
                <p>
                  "As a small business owner, I need reliable delivery partners
                  I can trust. DeliveryApp's transparent pricing, punctual
                  service, and professional drivers have exceeded my
                  expectations. Their mobile app is intuitive and saves me hours
                  every week."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img
                    src="https://randomuser.me/api/portraits/women/65.jpg"
                    alt="Customer"
                  />
                </div>
                <div className="author-info">
                  <h4>Emma Rodriguez</h4>
                  <p>Boutique Owner</p>
                  <div className="company-logo">
                    <img
                      src="https://placehold.co/80x30?text=Elegance"
                      alt="Company logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-indicators">
            <button className="indicator active"></button>
            <button className="indicator"></button>
            <button className="indicator"></button>
          </div>
        </div>

        <div className="client-logos">
          <h3>Trusted by leading brands</h3>
          <div className="logo-grid">
            <img
              src="https://placehold.co/120x40?text=Brand1"
              alt="Client logo"
            />
            <img
              src="https://placehold.co/120x40?text=Brand2"
              alt="Client logo"
            />
            <img
              src="https://placehold.co/120x40?text=Brand3"
              alt="Client logo"
            />
            <img
              src="https://placehold.co/120x40?text=Brand4"
              alt="Client logo"
            />
            <img
              src="https://placehold.co/120x40?text=Brand5"
              alt="Client logo"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <FiTruck className="footer-logo-icon" />
              <h3>DeliveryApp</h3>
            </div>
            <p>
              Your trusted delivery partner since 2023. We make shipping easy,
              reliable and affordable.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("about");
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("services");
                  }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("pricing");
                  }}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contact");
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="#express">Express Delivery</a>
              </li>
              <li>
                <a href="#standard">Standard Delivery</a>
              </li>
              <li>
                <a href="#international">International Shipping</a>
              </li>
              <li>
                <a href="#business">Business Solutions</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>{t.footer.support.title}</h4>
            <ul>
              <li>
                <a href="#faq">{t.footer.support.faq}</a>
              </li>
              <li>
                <a href="#tracking">{t.footer.support.tracking}</a>
              </li>
              <li>
                <a href="#privacy">{t.footer.support.privacy}</a>
              </li>
              <li>
                <a href="#terms">{t.footer.support.terms}</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>{t.footer.contact.title}</h4>
            <ul>
              <li>
                <FiPhoneCall /> {t.footer.contact.phone}
              </li>
              <li>{t.footer.contact.email}</li>
              <li>{t.footer.contact.address}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {t.common.appName}.{" "}
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
