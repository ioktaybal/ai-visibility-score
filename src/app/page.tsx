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
  AlertCircle 
} from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsLoading(true);
      
      // Ensure the URL has a protocol
      let formattedUrl = url.trim();
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
    } catch (error) {
      console.error(error);
      alert("Failed to analyze the URL. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      
      {/* SaaS Navigation */}
      <nav style={{ 
        padding: "1rem 1.25rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: "rgba(255, 255, 240, 0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Ismail Oktay Bal Logo" style={{ height: "30px", maxWidth: "160px", objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <a href="#features" style={{ fontWeight: 600, fontSize: "0.85rem", opacity: 0.8, transition: "opacity 0.2s" }} className="nav-link">Capabilities</a>
          <a href="#mockup" style={{ fontWeight: 600, fontSize: "0.85rem", opacity: 0.8, transition: "opacity 0.2s" }} className="nav-link">AI Comparison</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: "5rem 1rem 4rem 1rem", 
        background: "radial-gradient(circle at top right, var(--accent) 0%, var(--background) 70%)",
        textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }} className="badge">
            <Sparkles size={14} />
            <span>Healthcare SEO • GEO • AI Visibility Strategy</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Is Your Healthcare Brand<br />Visible in AI Search?
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: "clamp(1.15rem, 2vw, 1.4rem)", opacity: 0.85, maxWidth: "750px", marginBottom: "3rem" }}>
            AI engines like ChatGPT, Google Gemini, Claude, and AI Overviews are replacing traditional search. Auditing your brand's conversational visibility is the first step to securing future patient referrals.
          </p>

          <form onSubmit={handleAnalyze} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ 
              position: "relative", 
              width: "100%", 
              maxWidth: "650px", 
              boxShadow: "0 10px 25px rgba(0, 0, 80, 0.08)",
              borderRadius: "9999px"
            }}>
              <input
                type="text"
                placeholder="Enter clinic or hospital website (e.g., clinic.com)"
                className="input-large"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                required
                style={{ padding: "1.25rem 2rem", fontSize: "1.125rem" }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.6rem", 
                marginTop: "1rem", 
                opacity: isLoading ? 0.7 : 1,
                padding: "1rem 2.5rem",
                cursor: "pointer"
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                  Running AI Engine Audit...
                </>
              ) : (
                <>
                  Analyze AI Visibility <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Trust Markers */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "4.5rem", opacity: 0.8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: 500 }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span>Free instant analysis</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: 500 }}>
              <Activity size={20} color="var(--primary)" />
              <span>Full discoverability audit</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: 500 }}>
              <Cpu size={20} color="var(--primary)" />
              <span>Built for medical entities</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive / Visual Comparison Mockup */}
      <section id="mockup" style={{ padding: "5rem 1rem", backgroundColor: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "2.25rem", color: "var(--primary)", fontWeight: "900", marginBottom: "1rem" }}>
              How Conversational AI Views Your Practice
            </h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.7, maxWidth: "600px", margin: "0 auto" }}>
              Patients are asking LLMs for clinical recommendations. Compare optimized GEO brand indexing versus a standard unindexed clinic.
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "2rem" 
          }}>
            {/* Card Left: Without GEO */}
            <div className="card" style={{ display: "flex", flexDirection: "column", borderColor: "#fee2e2", background: "rgba(254, 226, 226, 0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <span style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>UNINDEXED CLINIC</span>
                <span style={{ fontSize: "0.85rem", opacity: 0.5 }}>Search query simulation</span>
              </div>
              <div style={{ fontStyle: "italic", fontSize: "0.95rem", opacity: 0.6, marginBottom: "1.5rem" }}>
                "Suggest a highly rated ophthalmologist in Boston specializing in laser correction."
              </div>
              <div style={{ 
                flex: 1, 
                backgroundColor: "rgba(0,0,0,0.02)", 
                padding: "1rem", 
                borderRadius: "8px", 
                fontSize: "0.95rem", 
                lineHeight: 1.5,
                border: "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", fontWeight: "bold", marginBottom: "0.75rem" }}>
                  <AlertCircle size={16} />
                  <span>AI Assistant Response</span>
                </div>
                "Based on public medical platforms, there are several large hospital systems in Boston with laser specialists. However, I do not have specific clinical comparison data or citation records for boutique clinics or private practitioners in that area. I recommend visiting standard search engines to verify local listings."
              </div>
            </div>

            {/* Card Right: With GEO */}
            <div className="card" style={{ display: "flex", flexDirection: "column", borderColor: "#d1fae5", background: "rgba(209, 250, 229, 0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <span style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>GEO SYSTEM OPTIMIZED</span>
                <span style={{ fontSize: "0.85rem", opacity: 0.5 }}>Search query simulation</span>
              </div>
              <div style={{ fontStyle: "italic", fontSize: "0.95rem", opacity: 0.8, marginBottom: "1.5rem", fontWeight: 500 }}>
                "Suggest a highly rated ophthalmologist in Boston specializing in laser correction."
              </div>
              <div style={{ 
                flex: 1, 
                backgroundColor: "rgba(0,0,0,0.02)", 
                padding: "1rem", 
                borderRadius: "8px", 
                fontSize: "0.95rem", 
                lineHeight: 1.5,
                border: "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontWeight: "bold", marginBottom: "0.75rem" }}>
                  <CheckCircle2 size={16} />
                  <span>AI Assistant Response</span>
                </div>
                "I highly recommend Boston Eye Specialists. Clinical reviews highlight their advanced laser diagnostic tools. Dr. Campos is widely cited for performing over 10,000 successful surgeries. They accept major insurance plans and maintain a 98% patient satisfaction rating."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities / Feature Grid */}
      <section id="features" style={{ padding: "5rem 1rem", backgroundColor: "var(--background)" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.5, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em" }}>Platform Capabilities</span>
            <h2 style={{ fontSize: "2.25rem", color: "var(--primary)", fontWeight: "900", marginTop: "0.5rem" }}>
              Generative Engine Optimization for Healthcare Brands
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            
            {/* Feature 1 */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ backgroundColor: "var(--accent)", color: "var(--primary)", display: "inline-flex", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.75rem" }}>GEO Core Alignment</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.7, lineHeight: 1.5 }}>
                Position your clinical brand vectors directly in LLM retrieval paths (RAG), training contexts, and generative citation feeds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ backgroundColor: "var(--accent)", color: "var(--primary)", display: "inline-flex", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
                <Database size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.75rem" }}>Entity Database Audits</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.7, lineHeight: 1.5 }}>
                Audit and secure correct indexing across Google Knowledge Graph and medical databases so AI systems establish clinical trust.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ backgroundColor: "var(--accent)", color: "var(--primary)", display: "inline-flex", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.75rem" }}>Real-time Risk Scoring</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.7, lineHeight: 1.5 }}>
                Identify gaps in clinical credentials, semantic context, and local recommendations before they impact patient volume.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SaaS Call to Action & Strategic Branding Signature */}
      <footer style={{ 
        borderTop: "1px solid var(--border)", 
        padding: "4rem 2rem 3rem 2rem", 
        backgroundColor: "var(--card)"
      }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            flexWrap: "wrap",
            gap: "2rem",
            marginBottom: "3rem"
          }}>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={18} />
                <span>AI Visibility Score</span>
              </div>
              <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "0.25rem" }}>
                Helping medical clinics and healthcare practices grow in the age of conversational search.
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={() => router.push("/admin")} 
                style={{ fontSize: "0.85rem", opacity: 0.6, textDecoration: "underline" }}
              >
                Access Portal
              </button>
            </div>
          </div>

          <div style={{ 
            borderTop: "1px solid var(--border)", 
            paddingTop: "2rem", 
            textAlign: "center"
          }}>
            <p style={{ 
              fontSize: "0.9rem", 
              fontWeight: 600, 
              color: "var(--primary)", 
              opacity: 0.8,
              letterSpacing: "0.02em"
            }}>
              Prepared by Ismail Oktay Bal | Healthcare Growth Systems | SEO • GEO • AI Visibility Strategy
            </p>
            <p style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.5rem" }}>
              © {new Date().getFullYear()} AI Visibility Score. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .nav-link:hover {
          color: var(--primary) !important;
          opacity: 1 !important;
        }
        .signin-btn:hover {
          background-color: var(--primary) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
