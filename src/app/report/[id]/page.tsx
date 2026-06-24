"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ReportData, RecommendationData } from "@/lib/db";
import { Lock, ArrowRight, CheckCircle, AlertCircle, Loader2, Target, BarChart2, BrainCircuit, MessageSquare, TrendingUp } from "lucide-react";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", location: "" });

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, reportId: unwrappedParams.id })
      });
      if (res.ok) {
        setIsUnlocked(true);
        // Persist local unlock state
        localStorage.setItem("lead_unlocked", "true");
        localStorage.setItem("client_first_name", formData.firstName);
        localStorage.setItem("client_last_name", formData.lastName);
        localStorage.setItem("client_location", formData.location);
        localStorage.setItem("client_email", formData.email);

        setReport(prev => prev ? { 
          ...prev, 
          client_name: `${formData.firstName} ${formData.lastName}`,
          client_location: formData.location
        } : null);
      }
      else alert("Something went wrong. Please try again.");
    } catch (err) {
      alert("Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchReport() {
      try {
        // Force no-store and add cache-busting timestamp
        const res = await fetch(`/api/report/${unwrappedParams.id}?t=${Date.now()}`, {
          cache: "no-store"
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReport(data);
        
        // Unlock if already stored in database OR localStorage
        const locallyUnlocked = localStorage.getItem("lead_unlocked") === "true";
        if (data.client_name || locallyUnlocked) {
          setIsUnlocked(true);
          // If unlocked locally, ensure database fields are set
          if (locallyUnlocked && !data.client_name) {
            const storedFirstName = localStorage.getItem("client_first_name") || "";
            const storedLastName = localStorage.getItem("client_last_name") || "";
            const storedLocation = localStorage.getItem("client_location") || "";
            
            setReport(prev => prev ? {
              ...prev,
              client_name: `${storedFirstName} ${storedLastName}`.trim() || undefined,
              client_location: storedLocation || undefined
            } : null);
          }
        }
      } catch (err) {
        setReport(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [unwrappedParams.id]);

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <h2>Report Not Found</h2>
        <button className="btn-primary" onClick={() => router.push("/")} style={{ marginTop: "2rem" }}>Go Back</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'HIGH' || status === 'WEAK') return '#ef4444'; // Red
    if (status === 'MEDIUM') return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  const pdfData = report.pdf_report_data || {
    brand_positioning: report.authority_score || 45,
    technical_infrastructure: report.seo_score || 55,
    entity_authority: report.ai_visibility_score || 42,
    geo_readiness: report.geo_score || 38,
    ai_citation_potential: report.trust_score || 35,
    knowledge_graph: Math.round(((report.ai_visibility_score || 42) + (report.authority_score || 45)) / 2),
    target_90_days: Math.min(94, report.overall_score + 18),
    target_180_days: Math.min(98, report.overall_score + 32),
    estimated_potential: `${Math.min(98, report.overall_score + 30)}–${Math.min(99, report.overall_score + 35)}/100`,
    visibility_recommendations: (report.geo_score || 38) >= 70 ? "High" : ((report.geo_score || 38) >= 45 ? "Moderate" : "Low"),
    likelihood_of_being_cited: (report.trust_score || 35) >= 70 ? "High" : ((report.trust_score || 35) >= 45 ? "Moderate" : "Low"),
    knowledge_graph_strength: (report.ai_visibility_score || 42) >= 70 ? "High" : ((report.ai_visibility_score || 42) >= 45 ? "Moderate" : "Low"),
    authority_recognition: (report.authority_score || 45) >= 70 ? "High" : ((report.authority_score || 45) >= 45 ? "Moderate" : "Low")
  };

  return (
    <div style={{ padding: "4rem 1rem", background: "var(--background)" }}>
      <div className="container">
        {/* Header (Conditional Premium Cover) */}
        {isUnlocked ? (
          <div className="card" style={{ 
            textAlign: "center", 
            marginBottom: "4.5rem", 
            background: "linear-gradient(135deg, var(--accent) 0%, var(--card) 100%)",
            padding: "4rem 2rem",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ marginBottom: "2rem" }}>
              <img src="/logo.png" alt="Ismail Oktay Bal Logo" style={{ height: "36px", objectFit: "contain", margin: "0 auto" }} />
            </div>
            <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>
              {report.overall_score} <span style={{fontSize: "1.5rem", fontWeight: "500", opacity: 0.6}}>/ 100</span>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "0.5rem", color: "var(--foreground)", letterSpacing: "-0.03em" }}>
              AI VISIBILITY SCORE
            </h1>
            <p style={{ fontSize: "1.15rem", fontWeight: "600", opacity: 0.8, color: "var(--primary)", marginBottom: "3rem" }}>
              Beyond Google. Beyond SEO.
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", borderTop: "1px solid var(--border)", paddingTop: "2.5rem", maxWidth: "650px", margin: "0 auto" }}>
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.5, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em" }}>Prepared For</span>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--foreground)", marginTop: "0.25rem" }}>{report.client_name || new URL(report.url).hostname}</div>
                {report.client_location && <div style={{ fontSize: "0.95rem", opacity: 0.7, marginTop: "0.1rem" }}>{report.client_location}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.5, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em" }}>Strategy Partner</span>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary)", marginTop: "0.25rem" }}>Ismail Oktay BAL</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", opacity: 0.8, marginTop: "0.1rem" }}>Healthcare Growth Systems</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.05rem" }}>SEO • GEO • AI Visibility Strategy</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center" style={{ marginBottom: "4rem" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <img src="/logo.png" alt="Ismail Oktay Bal Logo" style={{ height: "36px", objectFit: "contain", margin: "0 auto" }} />
            </div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>AI Visibility Intelligence for</h1>
            <a href={report.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)", textDecoration: "underline" }}>
              {new URL(report.url).hostname}
            </a>
          </div>
        )}

        {/* Section A: Executive Threat Summary */}
        <div className="card" style={{ marginBottom: "4rem", borderTop: `6px solid ${getStatusColor(report.ai_discoverability_risk)}` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>AI Discoverability Risk</h2>
            <div style={{ fontSize: "4rem", fontWeight: "900", color: getStatusColor(report.ai_discoverability_risk), margin: "1rem 0" }}>
              {report.ai_discoverability_risk}
            </div>
            <p style={{ fontSize: "1.25rem", maxWidth: "600px", color: "var(--foreground)" }}>
              Your brand may currently be underrepresented across AI-generated recommendations and conversational engines.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "bold", opacity: 0.7, marginBottom: "0.5rem", textTransform: "uppercase" }}>Google Entity Authority</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: getStatusColor(report.google_entity_authority) }}>{report.google_entity_authority}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "bold", opacity: 0.7, marginBottom: "0.5rem", textTransform: "uppercase" }}>ChatGPT Understanding</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: getStatusColor(report.chatgpt_understanding) }}>{report.chatgpt_understanding}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "bold", opacity: 0.7, marginBottom: "0.5rem", textTransform: "uppercase" }}>Healthcare Knowledge Graph</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: getStatusColor(report.healthcare_knowledge_graph) }}>{report.healthcare_knowledge_graph}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "bold", opacity: 0.7, marginBottom: "0.5rem", textTransform: "uppercase" }}>AI Ecosystem Readiness</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: getStatusColor(report.ai_ecosystem_readiness) }}>{report.ai_ecosystem_readiness}</div>
            </div>
          </div>
        </div>

        {/* Section B: Top Priority Actions & Why This Matters */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Target size={28} color="var(--primary)" /> Top Threat Mitigation Actions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            {report.recommendations?.map((rec: RecommendationData, idx: number) => (
              <div key={idx} className="card" style={{ borderLeft: `6px solid ${rec.severity === 'High' ? '#ef4444' : '#f59e0b'}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: rec.severity === 'High' ? '#ef4444' : '#f59e0b', marginBottom: "1rem", fontWeight: "bold", fontSize: "1.25rem" }}>
                  <AlertCircle size={24} />
                  <span>{rec.title}</span>
                </div>
                <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>{rec.description}</p>
                
                <div style={{ background: "var(--background)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
                  <h4 style={{ fontWeight: "bold", marginBottom: "1rem", color: "var(--foreground)" }}>Evidence:</h4>
                  <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                    {rec.evidence?.map((ev, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--primary)" }}>•</span> {ev}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "var(--background)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h4 style={{ fontWeight: "bold", color: "var(--foreground)", margin: 0 }}>Confidence Score:</h4>
                    <span style={{ fontWeight: "900", fontSize: "1.25rem", color: rec.confidence_score >= 80 ? '#10b981' : '#f59e0b' }}>{rec.confidence_score}%</span>
                  </div>
                  <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "var(--foreground)" }}>Potential Impact:</h4>
                  <ul style={{ listStyleType: "none", padding: 0, margin: 0, marginBottom: "1.5rem" }}>
                    {rec.potential_impact?.map((impact, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "#ef4444", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                        <span style={{ fontWeight: "bold", marginTop: "2px" }}>✗</span> <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                  {rec.estimated_lift && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "1rem" }}>
                      <span>Estimated visibility lift if fixed:</span>
                      <span style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "0.25rem 0.75rem", borderRadius: "999px" }}>{rec.estimated_lift}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UNLOCK CALL TO ACTION SECTION (Shows ONLY when locked) */}
        {!isUnlocked && (
          <div style={{ marginBottom: "4rem" }}>
            <div className="card" style={{ 
              maxWidth: "600px", 
              margin: "0 auto", 
              padding: "3rem 2.5rem", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 80, 0.15)",
              border: "2px solid var(--primary)",
              background: "var(--card)"
            }}>
              <Lock size={48} style={{ color: "var(--primary)", marginBottom: "1.25rem" }} />
              <h2 style={{ fontSize: "1.85rem", marginBottom: "0.75rem", textAlign: "center", fontWeight: 800, color: "var(--primary)", lineHeight: 1.25 }}>
                Unlock Premium AI Visibility Intelligence
              </h2>
              <p style={{ fontSize: "1.05rem", opacity: 0.85, marginBottom: "2rem", textAlign: "center", lineHeight: 1.5 }}>
                Access local competitor audits, entity database gaps, conversational queries, and your custom 90-day SEO/GEO threat roadmap.
                <br />
                <span style={{ color: "#10b981", fontWeight: "bold", display: "block", marginTop: "0.5rem" }}>
                  🔓 Access full report for free (Limited time)
                </span>
              </p>
              
              <form onSubmit={handleUnlock} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <input type="text" placeholder="First Name" required className="input-large" style={{ flex: 1, padding: "0.75rem 1rem", fontSize: "1rem" }} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  <input type="text" placeholder="Last Name" required className="input-large" style={{ flex: 1, padding: "0.75rem 1rem", fontSize: "1rem" }} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <input type="email" placeholder="Work Email" required className="input-large" style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem" }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="text" placeholder="Location (e.g. Madrid, Spain)" required className="input-large" style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem" }} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                
                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", width: "100%", cursor: "pointer" }}>
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Unlock Intelligence Report <ArrowRight size={20} /></>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PREMIUM SECTION - Blurred and height-restricted if locked */}
        <div className="card" style={{ 
          position: "relative", 
          overflow: "hidden", 
          padding: "4rem 2rem", 
          marginBottom: "4rem",
          height: isUnlocked ? "auto" : "360px",
          transition: "all 0.5s ease"
        }}>
          <div style={{ 
            filter: isUnlocked ? "none" : "blur(14px)", 
            opacity: isUnlocked ? 1 : 0.4, 
            userSelect: isUnlocked ? "auto" : "none", 
            pointerEvents: isUnlocked ? "auto" : "none",
            transition: "all 0.5s ease"
          }}>
            
            {/* Category Breakdown (Page 3 PDF) */}
            <div style={{ marginBottom: "4.5rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderBottom: "2px solid var(--border)", paddingBottom: "1rem", color: "var(--primary)", letterSpacing: "-0.025em" }}>
                Category Breakdown
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {[
                  {
                    title: "Brand Positioning",
                    score: pdfData.brand_positioning,
                    desc: "Your specialty and personal brand are clearly communicated online."
                  },
                  {
                    title: "Technical Infrastructure",
                    score: pdfData.technical_infrastructure,
                    desc: "Your website has a solid foundation but lacks AI-focused technical optimization."
                  },
                  {
                    title: "Entity Authority",
                    score: pdfData.entity_authority,
                    desc: "AI systems have limited trusted information connecting your name to broader authority sources."
                  },
                  {
                    title: "GEO Readiness",
                    score: pdfData.geo_readiness,
                    desc: "Your digital presence is not yet optimized for AI-generated recommendations."
                  },
                  {
                    title: "AI Citation Potential",
                    score: pdfData.ai_citation_potential,
                    desc: "Current content and authority signals provide few opportunities for AI systems to cite or recommend you."
                  }
                ].map((cat, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}>
                      <span style={{ fontSize: "1.15rem" }}>{cat.title}</span>
                      <span style={{ fontSize: "1.25rem", color: "var(--primary)" }}>{cat.score} <span style={{fontSize: "0.85rem", opacity: 0.5}}>/ 100</span></span>
                    </div>
                    <div style={{ width: "100%", height: "12px", backgroundColor: "var(--accent)", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{ width: `${cat.score}%`, height: "100%", background: "var(--primary-gradient)", borderRadius: "6px", transition: "width 1s ease" }}></div>
                    </div>
                    <p style={{ fontSize: "0.95rem", opacity: 0.8, color: "var(--foreground)" }}>{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What AI Systems Currently See (Page 4 PDF) */}
            <div style={{ marginBottom: "4.5rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderBottom: "2px solid var(--border)", paddingBottom: "1rem", color: "var(--primary)", letterSpacing: "-0.025em" }}>
                What AI Systems Currently See
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                {[
                  { label: "Visibility in AI Recommendations", rating: pdfData.visibility_recommendations, color: pdfData.visibility_recommendations === 'High' ? '#10b981' : (pdfData.visibility_recommendations === 'Moderate' ? '#f59e0b' : '#ef4444') },
                  { label: "Likelihood of Being Cited", rating: pdfData.likelihood_of_being_cited, color: pdfData.likelihood_of_being_cited === 'High' ? '#10b981' : (pdfData.likelihood_of_being_cited === 'Moderate' ? '#f59e0b' : '#ef4444') },
                  { label: "Knowledge Graph Strength", rating: pdfData.knowledge_graph_strength, color: pdfData.knowledge_graph_strength === 'High' ? '#10b981' : (pdfData.knowledge_graph_strength === 'Moderate' ? '#f59e0b' : '#ef4444') },
                  { label: "Authority Recognition", rating: pdfData.authority_recognition, color: pdfData.authority_recognition === 'High' ? '#10b981' : (pdfData.authority_recognition === 'Moderate' ? '#f59e0b' : '#ef4444') }
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.25rem", textAlign: "center" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", opacity: 0.6, textTransform: "uppercase", marginBottom: "0.5rem" }}>{item.label}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "800", color: item.color }}>{item.rating}</div>
                  </div>
                ))}
              </div>

              <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--accent)", borderBottom: "2px solid var(--border)" }}>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: "bold" }}>FACTOR</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: "bold", textTransform: "uppercase" }}>{report.client_name ? report.client_name.split(" ")[0] : "YOUR BRAND"}</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: "bold" }}>LEADING AI-VISIBLE BRANDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "bold" }}>ENTITY AUTHORITY</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "bold", color: "var(--primary)" }}>{pdfData.entity_authority}</td>
                      <td style={{ padding: "1rem 1.5rem", opacity: 0.7 }}>80+</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "bold" }}>CITATION SIGNALS</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "bold", color: "var(--primary)" }}>{pdfData.ai_citation_potential}</td>
                      <td style={{ padding: "1rem 1.5rem", opacity: 0.7 }}>75+</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "bold" }}>KNOWLEDGE GRAPH</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "bold", color: "var(--primary)" }}>{pdfData.knowledge_graph}</td>
                      <td style={{ padding: "1rem 1.5rem", opacity: 0.7 }}>85+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Growth Potential Timeline (Page 5 PDF) */}
            <div style={{ marginBottom: "4.5rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderBottom: "2px solid var(--border)", paddingBottom: "1rem", color: "var(--primary)", letterSpacing: "-0.025em" }}>
                Growth Potential
              </h2>
              
              <div style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--card) 100%)", borderRadius: "12px", padding: "2.5rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", position: "relative", zIndex: 2 }}>
                  <div style={{ textAlign: "center", flex: 1, minWidth: "120px" }}>
                    <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "var(--primary)" }}>{report.overall_score}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", opacity: 0.6, textTransform: "uppercase", marginTop: "0.25rem" }}>Current</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, flex: 1 }}>
                    <div style={{ height: "4px", width: "100%", backgroundColor: "var(--primary)", borderStyle: "dashed" }}></div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1, minWidth: "120px" }}>
                    <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "#f59e0b" }}>{pdfData.target_90_days}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", opacity: 0.6, textTransform: "uppercase", marginTop: "0.25rem" }}>90 Days Target</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, flex: 1 }}>
                    <div style={{ height: "4px", width: "100%", backgroundColor: "var(--primary)", borderStyle: "dashed" }}></div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1, minWidth: "120px" }}>
                    <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "#10b981" }}>{pdfData.target_180_days}+</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", opacity: 0.6, textTransform: "uppercase", marginTop: "0.25rem" }}>180 Days Target</div>
                  </div>
                </div>

                <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "1.05rem", fontWeight: "500", opacity: 0.8, color: "var(--foreground)" }}>
                  Increased AI visibility can improve patient discovery, brand authority, referral opportunities, and consultation demand.
                </p>
              </div>
            </div>

            {/* Recommended Roadmap (Page 6 & 7 PDF) */}
            <div style={{ marginBottom: "4.5rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderBottom: "2px solid var(--border)", paddingBottom: "1rem", color: "var(--primary)", letterSpacing: "-0.025em" }}>
                Recommended Roadmap & Next Steps
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  { phase: "Phase 1", title: "Authority Foundation", desc: "A detailed technical review of website architecture, structured data, entity relationships and AI-readability signals." },
                  { phase: "Phase 2", title: "AI Content Architecture", desc: "Building a content ecosystem designed to improve visibility in ChatGPT, Gemini, Claude, Perplexity and Google’s AI search experiences." },
                  { phase: "Phase 3", title: "Digital Authority Building", desc: "Expanding authority signals through strategic publications, citations, professional references and expert positioning." },
                  { phase: "Phase 4", title: "AI Citation Strategy", desc: "Increasing the likelihood of being referenced, recommended and cited in AI-generated answers related to your medical specialty." }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem" }}>
                    <div style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: "bold", fontSize: "0.95rem" }}>
                      {item.phase}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "0.25rem" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.95rem", opacity: 0.8, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", textAlign: "center", fontWeight: "bold", color: "#065f46" }}>
                Estimated AI Visibility Potential: {pdfData.estimated_potential}
              </div>
            </div>

            {/* Section C: How AI Models See Your Brand */}
            <div style={{ marginBottom: "4.5rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BrainCircuit size={28} /> How AI Models See Your Brand
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {report.ai_model_perception?.map((ai, idx) => (
                  <div key={idx} style={{ background: "var(--background)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {ai.model}
                      <span className="badge" style={{ fontSize: "0.75rem", background: ai.confidence === 'Strong' ? '#d1fae5' : (ai.confidence === 'Medium' ? '#fef3c7' : '#fee2e2'), color: ai.confidence === 'Strong' ? '#065f46' : (ai.confidence === 'Medium' ? '#92400e' : '#991b1b') }}>
                        {ai.confidence} Confidence
                      </span>
                    </h3>
                    <div style={{ marginBottom: "1rem" }}>
                      <span style={{ fontWeight: "bold", color: "#10b981", display: "block", marginBottom: "0.25rem" }}>Detected Signals:</span>
                      {ai.signals_detected?.map((u, i) => <div key={i} style={{ fontSize: "0.9rem", opacity: 0.8 }}>✓ {u}</div>)}
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold", color: "#ef4444", display: "block", marginBottom: "0.25rem" }}>Missing Signals:</span>
                      {ai.signals_missing?.map((m, i) => <div key={i} style={{ fontSize: "0.9rem", opacity: 0.8 }}>✗ {m}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW Section: Entity Gaps */}
            {report.entities && (
              <div style={{ marginBottom: "4rem" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Target size={28} /> Medical Entity Gaps
                </h2>
                <div style={{ background: "var(--background)", padding: "2rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ marginBottom: "2rem" }}>
                    <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Detected Semantic Entities:</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {report.entities.detected.length > 0 ? report.entities.detected.map((ent, i) => (
                        <span key={i} style={{ padding: "0.5rem 1rem", background: "#d1fae5", color: "#065f46", borderRadius: "999px", fontSize: "0.9rem", fontWeight: "600" }}>✓ {ent}</span>
                      )) : <span style={{ opacity: 0.6 }}>No medical entities detected in core content.</span>}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Missing Entity Opportunities:</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {report.entities.missing.map((ent, i) => (
                        <span key={i} style={{ padding: "0.5rem 1rem", background: "#f1f5f9", color: "#475569", borderRadius: "999px", fontSize: "0.9rem", fontWeight: "600" }}>{ent}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section D & F: Visibility Revenue Opportunity & Conversational Gaps */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
              {/* Visibility Revenue Opportunity */}
              <div style={{ background: "var(--accent)", color: "var(--accent-foreground)", padding: "2rem", borderRadius: "8px" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp size={24} /> Visibility Revenue Opportunity
                </h2>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "0.25rem" }}>Potential missed conversational opportunities:</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{report.visibility_opportunity?.missed_searches.toLocaleString()} <span style={{fontSize: "1rem", fontWeight: "normal"}}>monthly</span></div>
                </div>
                <div>
                  <div style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "0.25rem" }}>Estimated visibility upside:</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>+{report.visibility_opportunity?.estimated_lift_percentage}%</div>
                </div>
                <p style={{ marginTop: "1rem", fontSize: "0.85rem", opacity: 0.7 }}>* Estimated opportunity based on current semantic gaps vs known high-volume queries in your specialty.</p>
              </div>

              {/* Conversational Gaps (CSS Fixed) */}
              <div style={{ background: "var(--background)", padding: "2rem", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MessageSquare size={24} /> Questions People Ask AI That You Are Missing
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  {report.conversational_queries?.map((q: any, i: number) => (
                    <div key={i} style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "0.75rem", color: "var(--foreground)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        "{q.question}"
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                        <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "0.25rem 0.5rem", borderRadius: "4px", fontWeight: "500" }}>Intent: {q.intent}</span>
                        <span style={{ color: q.potential_value === 'High' ? '#10b981' : '#f59e0b', fontWeight: "bold" }}>Value: {q.potential_value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ color: "#ef4444", fontWeight: "600", fontSize: "0.9rem", marginTop: "auto" }}>⚠️ You currently have no optimized structured content targeting these conversational nodes.</p>
              </div>
            </div>

            {/* Section E: Competitor Intelligence Redesign (Conditionally Hidden) */}
            {report.competitors && report.competitors.length > 0 ? (
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><BarChart2 size={28} /> Competitors Appearing Stronger in AI Ecosystems</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {report.competitors.map((comp, idx) => (
                    <div key={idx} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--background)" }}>
                      <div style={{ flex: 1, minWidth: "250px", marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "1.25rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{comp.name}</h3>
                        <div style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.8 }}>Entity Strength: <span style={{fontWeight: "bold"}}>HIGH</span></div>
                      </div>
                      <div style={{ flex: 2, minWidth: "300px" }}>
                        <div style={{ fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", opacity: 0.7, marginBottom: "0.5rem" }}>Why they outperform you:</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          {(comp.reasons_outperforming || []).map((r, i) => (
                            <div key={i} style={{ fontSize: "0.95rem", color: "#10b981", fontWeight: "500" }}>✓ {r}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.5 }}><BarChart2 size={28} /> Competitor Intelligence</h2>
                <div style={{ padding: "3rem", textAlign: "center", background: "#f8fafc", border: "1px dashed var(--border)", borderRadius: "8px", color: "var(--foreground)", opacity: 0.7 }}>
                  <BarChart2 size={40} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Competitor analysis currently unavailable</h3>
                  <p>Insufficient local SERP and entity data detected. We do not generate assumed competitors without strict data evidence.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom fade mask when locked */}
          {!isUnlocked && (
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "150px",
              background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, var(--card) 100%)",
              pointerEvents: "none",
              zIndex: 5
            }}></div>
          )}
        </div>

      </div>
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
