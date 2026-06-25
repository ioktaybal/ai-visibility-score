"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Search, 
  AlertCircle,
  Brain,
  TrendingUp,
  Globe,
  Award,
  BookOpen,
  ArrowUpRight
} from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("chatgpt");
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setError("");
    const trimmed = url.trim();
    
    // Strip protocol to validate core domain shape
    const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
    
    // Check if there are spaces or it doesn't match a standard domain pattern (at least domain.tld)
    const domainRegex = /^[a-zA-Z0-9-][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}/;
    
    if (trimmed.includes(" ") || !domainRegex.test(withoutProtocol)) {
      setError("Please enter a valid website address (e.g., clinic.com or www.practice.com). Name inputs or search phrases are not supported.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Ensure the URL has a protocol
      let formattedUrl = trimmed;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      router.push(`/report/${data.reportId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to run the scan. Please verify that the website URL is correct and online.");
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-root">
      
      {/* Premium Sticky Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-brand">
            <img src="/logo.png" alt="AI Visibility Score Logo" className="logo-img" />
            <span className="brand-text">AI VISIBILITY</span>
          </div>
          <div className="nav-links">
            <button onClick={() => scrollToSection("features")} className="nav-link">Capabilities</button>
            <button onClick={() => scrollToSection("how-it-works")} className="nav-link">How It Works</button>
            <button onClick={() => scrollToSection("pricing")} className="nav-link">Pricing</button>
            <button onClick={() => router.push("/admin")} className="nav-link-secondary">Access Portal</button>
            <button onClick={() => scrollToSection("scan-section")} className="nav-btn-primary">Run Scan</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="scan-section">
        <div className="container hero-grid">
          
          {/* Left Column: Heading & Scanner */}
          <div className="hero-content fade-up-slow">
            <div className="badge-luxury">
              <Sparkles size={12} className="badge-icon" />
              <span>THE NEW ERA OF PATIENT ACQUISITION</span>
            </div>

            <h1 className="hero-title">
              Is AI Recommending You?
            </h1>
            
            <p className="hero-subtitle">
              Patients are no longer searching only on Google. They’re asking ChatGPT, Gemini, and AI-powered search. We make sure you are the professional AI recommends.
            </p>

            <form onSubmit={handleAnalyze} className="scan-form">
              <div className="input-wrapper">
                <Search size={20} className="input-search-icon" />
                <input
                  type="text"
                  placeholder="Enter website (e.g., ergunkurun.com)"
                  className="scanner-input"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isLoading}
                  required
                />
                <button 
                  type="submit" 
                  className="scanner-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>Scan Now</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="error-badge">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </form>

            <div className="hero-trust-row">
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <span>Free instant analysis</span>
              </div>
              <div className="trust-item">
                <Activity size={18} className="trust-icon" />
                <span>Full discoverability audit</span>
              </div>
              <div className="trust-item">
                <Cpu size={18} className="trust-icon" />
                <span>Built for medical entities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating iOS/Apple-Health Widget Mockup */}
          <div className="hero-graphics blur-in">
            <div className="widget-card main-widget">
              <div className="widget-header">
                <div className="widget-status">
                  <span className="status-dot pulsing"></span>
                  <span className="status-text">LIVE AI VISIBILITY DECRYPTOR</span>
                </div>
                <div className="widget-model-tags">
                  <span className="model-tag">GPT-4o</span>
                  <span className="model-tag">Gemini Pro</span>
                </div>
              </div>

              <div className="widget-score-section">
                {/* SVG Apple-health style circle */}
                <div className="svg-ring-container">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="svg-ring">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="var(--border)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="var(--accent-gold)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - 0.72)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="score-center">
                    <span className="score-num">72</span>
                    <span className="score-total">/100</span>
                  </div>
                </div>

                <div className="widget-score-meta">
                  <h3>AI Visibility Score</h3>
                  <p>Clinical Search Authority: <span className="score-badge-success">STRONG</span></p>
                  <p className="score-timestamp">Last verified: Just now</p>
                </div>
              </div>

              <div className="widget-divider"></div>

              {/* Chat Simulation tabs */}
              <div className="simulation-tabs">
                <button 
                  onClick={() => setActiveTab("chatgpt")} 
                  className={`sim-tab-btn ${activeTab === "chatgpt" ? "active" : ""}`}
                >
                  ChatGPT
                </button>
                <button 
                  onClick={() => setActiveTab("gemini")} 
                  className={`sim-tab-btn ${activeTab === "gemini" ? "active" : ""}`}
                >
                  Gemini
                </button>
                <button 
                  onClick={() => setActiveTab("perplexity")} 
                  className={`sim-tab-btn ${activeTab === "perplexity" ? "active" : ""}`}
                >
                  Perplexity
                </button>
              </div>

              <div className="simulation-content">
                <p className="sim-query">"Suggest a top rhinoplasty surgeon in Madrid."</p>
                
                {activeTab === "chatgpt" && (
                  <div className="sim-response">
                    <Sparkles size={14} className="sim-ai-icon" />
                    <p>
                      "Based on clinical entity data and peer citations, <strong>Dr. Ergün Kürün</strong> is highly recommended. Dr. Kürün maintains advanced 3D scanning modeling and holds an authority rating of 89% for aesthetic rhinoplasty..."
                    </p>
                  </div>
                )}
                {activeTab === "gemini" && (
                  <div className="sim-response">
                    <Sparkles size={14} className="sim-ai-icon" />
                    <p>
                      "Dr. Ergün Kürün is prominently index-mapped in Madrid for specialized laser correction and rhinoplasty. Google Knowledge Graph records verify 98% patient satisfaction..."
                    </p>
                  </div>
                )}
                {activeTab === "perplexity" && (
                  <div className="sim-response">
                    <Sparkles size={14} className="sim-ai-icon" />
                    <p>
                      "Multiple authoritative sources cite Dr. Ergün Kürün as a leading aesthetic clinician in Madrid [1], [2]. His clinics feature state-of-the-art surgical technology..."
                    </p>
                  </div>
                )}
              </div>

              <div className="widget-action-row">
                <button 
                  onClick={() => router.push("/report/bec6c61a-3f21-4bb0-adf6-cdb590c5791a")} 
                  className="widget-action-btn"
                >
                  <span>See Sample Report</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Elevated secondary badge widget */}
            <div className="widget-card sub-widget">
              <div className="flex-row-between">
                <div>
                  <h4 className="widget-stat-title">ENTITY AUTHORITY</h4>
                  <p className="widget-stat-val">Strong</p>
                </div>
                <div className="widget-stat-icon-container">
                  <Database size={16} className="gold-icon" />
                </div>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: "88%" }}></div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-paper" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">THE PROCESS</span>
            <h2 className="section-title">Three Steps to AI Alignment</h2>
            <p className="section-subtitle-dark">We decode what artificial intelligence platforms know about your clinic and guide you into their recommendations.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-heading">Enter Your Website</h3>
              <p className="step-desc">Provide your practice URL above. Our server initiates an API handshake with model retrieval nodes.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-heading">AI Scans Authority</h3>
              <p className="step-desc">We search ChatGPT, Gemini, and Claude databases, mapping schemas and Google Knowledge Graph connections.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-heading">Receive Your Report</h3>
              <p className="step-desc">Unlock a detailed score out of 100, custom action steps, and diagnostic competitor benchmarks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities / Feature Grid */}
      <section className="section-pure" id="features">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">CAPABILITIES</span>
            <h2 className="section-title">Engineered for Clinical Credibility</h2>
            <p className="section-subtitle-dark">Traditional SEO is built for algorithms. Generative Engine Optimization (GEO) is built for artificial intelligence.</p>
          </div>

          <div className="features-grid">
            
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={24} className="feature-icon" />
              </div>
              <h3>AI Visibility Score</h3>
              <p>A unified metric calculated across the top 5 AI conversational models, grading your practice's recommendability profile.</p>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Brain size={24} className="feature-icon" />
              </div>
              <h3>Authority Signals</h3>
              <p>Track your digital credentials, scientific citations, and board certificates as verified by AI training set scrapers.</p>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Database size={24} className="feature-icon" />
              </div>
              <h3>Knowledge Graph Analysis</h3>
              <p>Examine how semantic entity engines, schema structures, and medical registries bridge your practice data.</p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Activity size={24} className="feature-icon" />
              </div>
              <h3>Citation Potential</h3>
              <p>Identify missing links in journals, public clinical listings, and editorial media that feed AI real-time data sources.</p>
            </div>

            {/* Card 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Globe size={24} className="feature-icon" />
              </div>
              <h3>AI Readiness</h3>
              <p>Verify if your page architecture allows crawlers to ingest services, medical definitions, and specialty services.</p>
            </div>

            {/* Card 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <TrendingUp size={24} className="feature-icon" />
              </div>
              <h3>Competitor Comparison</h3>
              <p>Discover which competitive clinics are claiming patient share in conversational search, and why they dominate.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Editorial Testimonial Section */}
      <section className="section-paper">
        <div className="container testimonial-container">
          <div className="testimonial-card-editorial">
            <div className="testimonial-image-col">
              <img src="/testimonial_doctor.png" alt="Dr. Campos" className="editorial-img" />
            </div>
            <div className="testimonial-text-col">
              <span className="testimonial-tag">SUCCESS STORY</span>
              <p className="testimonial-quote">
                "Our practice saw a 45% increase in high-intent patient inquiries over six months. When patients ask AI who the top plastic surgeon in Madrid is, our clinic is now consistently recommended."
              </p>
              <div className="testimonial-author">
                <h4>Dr. Sofia Campos</h4>
                <p>Founder, Campos Aesthetic Clinic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section className="section-pure" id="pricing">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">PRICING PLANS</span>
            <h2 className="section-title">Transparent, Value-Focused</h2>
            <p className="section-subtitle-dark">Choose the tracking frequency and support tier matching your growth expectations.</p>
          </div>

          <div className="pricing-grid">
            {/* Starter */}
            <div className="pricing-card">
              <h3 className="plan-name">Starter</h3>
              <p className="plan-desc">For individual practitioners establishing basic AI visibility.</p>
              <div className="price-row">
                <span className="price-symbol">$</span>
                <span className="price-amount">0</span>
                <span className="price-period">/mo</span>
              </div>
              <ul className="plan-features">
                <li><CheckCircle2 size={16} className="check-icon" /> <span>1 Scanned domain</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Basic AI model scan</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Initial recommendations</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>PDF export access</span></li>
              </ul>
              <button onClick={() => scrollToSection("scan-section")} className="btn-secondary-plan">Get Free Scan</button>
            </div>

            {/* Growth */}
            <div className="pricing-card highlighted">
              <div className="card-badge-gold">RECOMMENDED</div>
              <h3 className="plan-name">Growth</h3>
              <p className="plan-desc">For clinics actively competing for AI search recommendations.</p>
              <div className="price-row">
                <span className="price-symbol">$</span>
                <span className="price-amount">199</span>
                <span className="price-period">/mo</span>
              </div>
              <ul className="plan-features">
                <li><CheckCircle2 size={16} className="check-icon" /> <span>3 Scanned domains</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Bi-weekly automated audits</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Full entity connection tracking</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Competitor comparative reports</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Custom growth roadmap mapping</span></li>
              </ul>
              <button onClick={() => scrollToSection("scan-section")} className="btn-primary-plan">Subscribe & Align</button>
            </div>

            {/* Enterprise */}
            <div className="pricing-card">
              <h3 className="plan-name">Enterprise</h3>
              <p className="plan-desc">For healthcare networks and large multi-location groups.</p>
              <div className="price-row">
                <span className="price-symbol">Custom</span>
              </div>
              <ul className="plan-features">
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Unlimited scanned domains</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Real-time scanner updates</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Dedicated clinical growth advisor</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>Custom API integration support</span></li>
                <li><CheckCircle2 size={16} className="check-icon" /> <span>White-label client portal option</span></li>
              </ul>
              <button onClick={() => scrollToSection("scan-section")} className="btn-secondary-plan">Contact Solutions</button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Block */}
      <section className="dark-cta-section">
        <div className="container dark-cta-content text-center">
          <span className="cta-mini-label">FUTURE-READY CLINICAL SEO</span>
          <h2>Secure Your Place in Conversational Search</h2>
          <p>Don't let competitors claim all patient recommendations in the AI ecosystem. Run your free diagnostic scan now.</p>
          <button onClick={() => scrollToSection("scan-section")} className="dark-cta-btn">
            <span>Analyze Your Brand Instantly</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-dark">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <Sparkles size={16} className="gold-icon" />
              <span>AI Visibility Platform</span>
            </div>
            <p className="footer-brand-desc">
              We help healthcare professionals, private practices, and medical groups secure digital authority and become the recommendations AI engines present to patients.
            </p>
          </div>
          <div className="footer-links-col">
            <h4>Solutions</h4>
            <button onClick={() => scrollToSection("features")} className="footer-link">Capabilities</button>
            <button onClick={() => scrollToSection("how-it-works")} className="footer-link">How It Works</button>
            <button onClick={() => scrollToSection("pricing")} className="footer-link">Pricing</button>
          </div>
          <div className="footer-links-col">
            <h4>Resources</h4>
            <button onClick={() => router.push("/admin")} className="footer-link">Admin Portal</button>
            <button onClick={() => router.push("/report/bec6c61a-3f21-4bb0-adf6-cdb590c5791a")} className="footer-link">Demo Audit</button>
          </div>
        </div>

        <div className="container footer-bottom">
          <p className="footer-sig">
            Prepared by Ismail Oktay Bal | Healthcare Growth Systems | SEO • GEO • AI Visibility Strategy
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} AI Visibility Platform. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Inline Scoped Styles for Apple / Linear Premium Aesthetics */}
      <style jsx>{`
        .landing-root {
          background-color: var(--background);
          color: var(--foreground);
          min-height: 100vh;
          font-family: var(--font-sans);
          overflow-x: hidden;
        }

        /* Navbar Styling */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(248, 246, 242, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 1.25rem 0;
          transition: background-color 0.3s;
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-img {
          height: 32px;
          width: auto;
          object-fit: contain;
        }
        .brand-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.05em;
          color: var(--foreground);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--secondary-text);
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-link:hover {
          color: var(--foreground);
        }
        .nav-link-secondary {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--secondary-text);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link-secondary:hover {
          color: var(--foreground);
        }
        .nav-btn-primary {
          background-color: var(--dark-surface);
          color: #ffffff;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-lg);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        .nav-btn-primary:hover {
          background-color: #1e2638;
          transform: translateY(-1px);
        }

        /* Hero Layout */
        .hero-section {
          padding: 6.5rem 0 5rem 0;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .badge-luxury {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #ffffff;
          border: 1px solid var(--border);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-gold);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        .badge-icon {
          color: var(--accent-gold);
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.25rem);
          color: var(--foreground);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: var(--secondary-text);
          line-height: 1.5;
          margin-bottom: 2.5rem;
          max-width: 580px;
        }

        /* Premium Scan Form */
        .scan-form {
          width: 100%;
          max-width: 550px;
          margin-bottom: 2rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 0.5rem;
          box-shadow: var(--shadow-md);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .input-wrapper:focus-within {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 4px rgba(200, 163, 106, 0.08);
        }
        .input-search-icon {
          color: var(--secondary-text);
          margin-left: 1rem;
          flex-shrink: 0;
        }
        .scanner-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 0.5rem 0.75rem 0.75rem;
          font-size: 1.05rem;
          font-family: var(--font-sans);
          outline: none;
          color: var(--foreground);
          width: 100%;
        }
        .scanner-input::placeholder {
          color: var(--secondary-text);
          opacity: 0.65;
        }
        .scanner-btn {
          background-color: var(--dark-surface);
          color: #ffffff;
          border-radius: var(--radius-md);
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        .scanner-btn:hover {
          background-color: #1e2638;
          transform: translateY(-1px);
        }
        .scanner-btn:active {
          transform: translateY(0);
        }
        .error-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #c2410c;
          font-size: 0.85rem;
          background-color: #fff7ed;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid #ffedd5;
          margin-top: 0.75rem;
          font-weight: 500;
        }

        /* Hero Trust Badges */
        .hero-trust-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--secondary-text);
        }
        .trust-icon {
          color: var(--accent-gold);
        }

        /* Widgets Right Column */
        .hero-graphics {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .widget-card {
          background: var(--secondary-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 440px;
          position: relative;
          transition: transform 0.3s;
        }
        .widget-card:hover {
          transform: translateY(-3px);
        }
        .main-widget {
          z-index: 10;
        }
        .sub-widget {
          margin-top: 1.5rem;
          max-width: 400px;
          padding: 1.25rem 1.75rem;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: var(--shadow-md);
          z-index: 5;
        }
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .widget-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--success);
        }
        .pulsing {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(46, 139, 87, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(46, 139, 87, 0); }
          100% { box-shadow: 0 0 0 0 rgba(46, 139, 87, 0); }
        }
        .status-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--secondary-text);
        }
        .widget-model-tags {
          display: flex;
          gap: 0.4rem;
        }
        .model-tag {
          font-size: 0.65rem;
          font-weight: 600;
          background-color: var(--background);
          color: var(--secondary-text);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border);
        }
        .widget-score-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .svg-ring-container {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }
        .svg-ring {
          transform: rotate(-90deg);
        }
        .score-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
        }
        .score-num {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--foreground);
        }
        .score-total {
          font-size: 0.7rem;
          color: var(--secondary-text);
          font-weight: 600;
        }
        .widget-score-meta h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .widget-score-meta p {
          font-size: 0.825rem;
          color: var(--secondary-text);
        }
        .score-badge-success {
          color: var(--success);
          font-weight: 700;
        }
        .score-timestamp {
          font-size: 0.725rem !important;
          opacity: 0.6;
          margin-top: 0.25rem;
        }
        .widget-divider {
          height: 1px;
          background-color: var(--border);
          margin: 1.5rem 0;
        }
        .simulation-tabs {
          display: flex;
          background-color: var(--background);
          border: 1px solid var(--border);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .sim-tab-btn {
          flex: 1;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary-text);
          padding: 0.4rem 0;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sim-tab-btn.active {
          background-color: #ffffff;
          color: var(--foreground);
          box-shadow: var(--shadow-sm);
        }
        .simulation-content {
          background-color: var(--background);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          border: 1px solid var(--border);
        }
        .sim-query {
          font-size: 0.8rem;
          font-style: italic;
          color: var(--secondary-text);
          margin-bottom: 0.75rem;
        }
        .sim-response {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--foreground);
        }
        .sim-ai-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .widget-action-row {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }
        .widget-action-btn {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          background: none;
          border: none;
          transition: opacity 0.2s;
        }
        .widget-action-btn:hover {
          opacity: 0.8;
        }
        .flex-row-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .widget-stat-title {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--secondary-text);
          margin-bottom: 0.15rem;
        }
        .widget-stat-val {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--foreground);
        }
        .widget-stat-icon-container {
          background-color: var(--background);
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gold-icon {
          color: var(--accent-gold);
        }
        .bar-bg {
          height: 4px;
          background-color: var(--border);
          border-radius: 2px;
          margin-top: 1rem;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background-color: var(--accent-gold);
          border-radius: 2px;
        }

        /* Generic Section Styling */
        .section-paper {
          padding: 6.5rem 0;
          background-color: #ffffff;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .section-pure {
          padding: 6.5rem 0;
          background-color: var(--background);
        }
        .section-header {
          margin-bottom: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .section-label {
          font-size: 0.725rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent-gold);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        .section-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--foreground);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .section-subtitle-dark {
          font-size: 1.05rem;
          color: var(--secondary-text);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Steps Layout */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 1.5rem;
        }
        .step-card {
          padding: 2.5rem 2rem;
          border-radius: var(--radius-lg);
          background-color: var(--background);
          border: 1px solid var(--border);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .step-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .step-number {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--accent-gold);
          margin-bottom: 1.5rem;
        }
        .step-heading {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .step-desc {
          font-size: 0.9rem;
          color: var(--secondary-text);
          line-height: 1.55;
        }

        /* Features Layout */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .feature-card {
          background-color: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          box-shadow: var(--shadow-sm);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .feature-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .feature-icon-wrapper {
          display: inline-flex;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          background-color: var(--background);
          margin-bottom: 1.5rem;
          border: 1px solid var(--border);
        }
        .feature-icon {
          color: var(--foreground);
        }
        .feature-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .feature-card p {
          font-size: 0.875rem;
          color: var(--secondary-text);
          line-height: 1.55;
        }

        /* Editorial Testimonial */
        .testimonial-container {
          max-width: 1000px;
        }
        .testimonial-card-editorial {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .testimonial-image-col {
          position: relative;
          min-height: 380px;
          background-color: #e5e7eb;
        }
        .editorial-img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .testimonial-text-col {
          padding: 4rem 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          background-color: #ffffff;
        }
        .testimonial-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent-gold);
          margin-bottom: 1.5rem;
        }
        .testimonial-quote {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.45;
          color: var(--foreground);
          margin-bottom: 2rem;
          letter-spacing: -0.01em;
        }
        .testimonial-author h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.15rem;
        }
        .testimonial-author p {
          font-size: 0.85rem;
          color: var(--secondary-text);
        }

        /* Pricing Layout */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.25rem;
          margin-top: 1.5rem;
          align-items: stretch;
        }
        .pricing-card {
          background-color: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 3rem 2.25rem;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .pricing-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .pricing-card.highlighted {
          border: 2px solid var(--accent-gold);
          box-shadow: var(--shadow-lg);
        }
        .card-badge-gold {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--accent-gold);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
        }
        .plan-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }
        .plan-desc {
          font-size: 0.825rem;
          color: var(--secondary-text);
          line-height: 1.45;
          margin-bottom: 2rem;
          min-height: 48px;
        }
        .price-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 2.5rem;
        }
        .price-symbol {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
          margin-right: 0.15rem;
        }
        .price-amount {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--foreground);
          line-height: 1;
        }
        .price-period {
          font-size: 0.9rem;
          color: var(--secondary-text);
          margin-left: 0.25rem;
        }
        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3rem;
          flex: 1;
        }
        .plan-features li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--foreground);
        }
        .check-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .btn-secondary-plan {
          background-color: transparent;
          color: var(--foreground);
          border: 1px solid var(--border);
          padding: 0.85rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-secondary-plan:hover {
          background-color: var(--background);
        }
        .btn-primary-plan {
          background-color: var(--dark-surface);
          color: #ffffff;
          padding: 0.85rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-primary-plan:hover {
          background-color: #1e2638;
        }

        /* Dark CTA Section */
        .dark-cta-section {
          padding: 7.5rem 0;
          background-color: var(--dark-surface);
          color: #ffffff;
          border-bottom: 1px solid #1a2233;
        }
        .dark-cta-content {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cta-mini-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          margin-bottom: 1.5rem;
        }
        .dark-cta-content h2 {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          margin-bottom: 1.25rem;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .dark-cta-content p {
          font-size: 1.05rem;
          color: #94a3b8;
          line-height: 1.55;
          margin-bottom: 2.5rem;
          max-width: 580px;
        }
        .dark-cta-btn {
          background-color: var(--accent-gold);
          color: #ffffff;
          padding: 1rem 2.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }
        .dark-cta-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        /* Footer Dark */
        .footer-dark {
          background-color: var(--dark-surface);
          color: #94a3b8;
          padding: 5rem 0 3rem 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 4rem;
          border-bottom: 1px solid #1a2233;
          padding-bottom: 3.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-brand-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
        }
        .footer-brand-desc {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #64748b;
          max-width: 380px;
        }
        .footer-links-col h4 {
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }
        .footer-link {
          background: none;
          border: none;
          padding: 0;
          color: #94a3b8;
          font-size: 0.875rem;
          display: block;
          margin-bottom: 0.85rem;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .footer-sig {
          font-size: 0.825rem;
          font-weight: 600;
          color: #ffffff;
          opacity: 0.8;
        }
        .footer-copy {
          font-size: 0.8rem;
          color: #475569;
        }

        /* Responsive Media Queries */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .hero-graphics {
            margin-top: 1rem;
          }
          .steps-grid, .features-grid, .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .testimonial-card-editorial {
            grid-template-columns: 1fr;
          }
          .testimonial-image-col {
            min-height: 300px;
          }
          .testimonial-text-col {
            padding: 3rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .steps-grid, .features-grid, .pricing-grid, .footer-grid {
            grid-template-columns: 1fr;
          }
          .hero-section {
            padding: 4.5rem 0 3rem 0;
          }
          .hero-graphics {
            width: 100%;
          }
          .widget-card {
            max-width: 100%;
          }
          .sub-widget {
            display: none;
          }
          .footer-grid {
            gap: 2.5rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
