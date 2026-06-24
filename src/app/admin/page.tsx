"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  loginAdminAction, 
  logoutAdminAction, 
  checkAdminAuth, 
  getReportsListAction, 
  getLeadsListAction 
} from "./actions";
import { LeadWithUrl } from "@/lib/db";
import { 
  Lock, 
  Loader2, 
  LogOut, 
  Globe, 
  Users, 
  Download, 
  Search, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Database 
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"scans" | "leads">("scans");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [reports, setReports] = useState<any[]>([]);
  const [leads, setLeads] = useState<LeadWithUrl[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Authenticate and load
  const checkAuthAndLoad = async () => {
    console.log("[Client] checkAuthAndLoad checking authentication status...");
    try {
      const auth = await checkAdminAuth();
      console.log("[Client] checkAuthAndLoad auth status result:", auth);
      setIsAuthenticated(auth);
      if (auth) {
        console.log("[Client] checkAuthAndLoad user is authenticated, loading data...");
        await loadDashboardData();
      }
    } catch (e) {
      console.error("[Client] checkAuthAndLoad error checking auth:", e);
      setIsAuthenticated(false);
    }
  };

  const loadDashboardData = async () => {
    console.log("[Client] loadDashboardData starting fetch...");
    setIsLoadingData(true);
    try {
      console.log("[Client] loadDashboardData triggering Promise.all for reports and leads...");
      const [reportsData, leadsData] = await Promise.all([
        getReportsListAction(),
        getLeadsListAction()
      ]);
      console.log("[Client] loadDashboardData fetch completed. Reports:", reportsData.length, "Leads:", leadsData.length);
      setReports(reportsData);
      setLeads(leadsData);
    } catch (e) {
      console.error("[Client] loadDashboardData error loading data:", e);
    } finally {
      setIsLoadingData(false);
      console.log("[Client] loadDashboardData loading state set to false.");
    }
  };

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Client] handleLogin form submitted...");
    setIsSubmitting(true);
    setLoginError("");
    try {
      console.log("[Client] handleLogin calling loginAdminAction server action...");
      const res = await loginAdminAction(password);
      console.log("[Client] handleLogin server action response:", res);
      if (res.success) {
        console.log("[Client] handleLogin login success! Setting authenticated state to true...");
        setIsAuthenticated(true);
        await loadDashboardData();
      } else {
        setLoginError(res.error || "Incorrect password.");
      }
    } catch (err) {
      console.error("[Client] handleLogin error submitting form:", err);
      setLoginError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("[Client] handleLogin submitting state set to false.");
    }
  };

  const handleLogout = async () => {
    console.log("[Client] handleLogout triggered...");
    try {
      await logoutAdminAction();
      console.log("[Client] handleLogout success. Resetting client states...");
      setIsAuthenticated(false);
      setReports([]);
      setLeads([]);
      setPassword("");
    } catch (e) {
      console.error("[Client] handleLogout error logging out:", e);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--background)" }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "100vh", 
        padding: "1rem",
        background: "radial-gradient(circle at top right, var(--accent) 0%, var(--background) 70%)"
      }}>
        <div className="card" style={{ 
          maxWidth: "450px", 
          width: "100%", 
          padding: "3rem 2.5rem", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          border: "1px solid var(--border)",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)"
        }}>
          <div style={{ 
            backgroundColor: "var(--accent)", 
            color: "var(--accent-foreground)", 
            padding: "1rem", 
            borderRadius: "50%", 
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", fontWeight: "800", color: "var(--primary)" }}>Admin Portal</h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.7, marginBottom: "2rem", textAlign: "center" }}>
            Enter your administrator password to view the AI Visibility Dashboard data.
          </p>

          <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input 
                type="password" 
                placeholder="Admin Password" 
                required 
                className="input-large" 
                style={{ 
                  width: "100%", 
                  maxWidth: "100%", 
                  padding: "0.85rem 1.25rem", 
                  fontSize: "1rem",
                  borderRadius: "8px",
                  textAlign: "center"
                }} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            
            {loginError && (
              <span style={{ color: "#ef4444", fontSize: "0.875rem", textAlign: "center", fontWeight: "500" }}>
                ⚠️ {loginError}
              </span>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.5rem", 
                marginTop: "0.5rem", 
                width: "100%",
                padding: "0.85rem 1.5rem",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  const totalScans = reports.length;
  const totalLeads = leads.length;
  const conversionRate = totalScans > 0 ? ((totalLeads / totalScans) * 100).toFixed(1) : "0.0";

  // Filter lists based on tab & query
  const filteredReports = reports.filter(r => 
    r.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    l.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.url || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    if (risk === "HIGH") return { bg: "#fee2e2", text: "#991b1b" }; // Red
    if (risk === "MEDIUM") return { bg: "#fef3c7", text: "#92400e" }; // Yellow
    return { bg: "#d1fae5", text: "#065f46" }; // Green
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", padding: "2rem 1rem" }}>
      <div className="container">
        
        {/* Top Navbar */}
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "3rem", 
          paddingBottom: "1.5rem", 
          borderBottom: "1px solid var(--border)" 
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <img src="/logo.png" alt="Ismail Oktay Bal Logo" style={{ height: "30px", objectFit: "contain" }} />
              <span style={{ fontSize: "1.1rem", opacity: 0.4, fontWeight: "normal" }}>|</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary)" }}>AI Visibility Console</span>
            </div>
            <p style={{ opacity: 0.6, fontSize: "0.9rem", marginTop: "0.35rem" }}>Admin Analysis & Lead Tracking Console</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              padding: "0.5rem 1rem", 
              borderRadius: "8px", 
              border: "1px solid var(--border)", 
              color: "#ef4444", 
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all 0.2s"
            }}
            className="logout-btn"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Stats Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {/* Card 1 */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "var(--accent)", color: "var(--primary)", padding: "1rem", borderRadius: "12px" }}>
              <Globe size={28} />
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", opacity: 0.6, fontWeight: 500 }}>Total Scans</div>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--primary)" }}>{totalScans}</div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "1rem", borderRadius: "12px" }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", opacity: 0.6, fontWeight: 500 }}>Total Leads Captured</div>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "#10b981" }}>{totalLeads}</div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "1rem", borderRadius: "12px" }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", opacity: 0.6, fontWeight: 500 }}>Lead Conversion Rate</div>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "#f59e0b" }}>{conversionRate}%</div>
            </div>
          </div>
        </section>

        {/* List Section */}
        <div className="card" style={{ padding: 0, overflow: "hidden", borderRadius: "12px" }}>
          
          {/* List Headers & Controls */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "1.5rem", 
            borderBottom: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => { setActiveTab("scans"); setSearchQuery(""); }}
                style={{ 
                  padding: "0.6rem 1.25rem", 
                  borderRadius: "8px", 
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  backgroundColor: activeTab === "scans" ? "var(--primary)" : "transparent",
                  color: activeTab === "scans" ? "#fff" : "var(--foreground)",
                  opacity: activeTab === "scans" ? 1 : 0.7,
                  transition: "all 0.2s"
                }}
              >
                Scanned Sites ({totalScans})
              </button>
              <button 
                onClick={() => { setActiveTab("leads"); setSearchQuery(""); }}
                style={{ 
                  padding: "0.6rem 1.25rem", 
                  borderRadius: "8px", 
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  backgroundColor: activeTab === "leads" ? "var(--primary)" : "transparent",
                  color: activeTab === "leads" ? "#fff" : "var(--foreground)",
                  opacity: activeTab === "leads" ? 1 : 0.7,
                  transition: "all 0.2s"
                }}
              >
                Captured Leads ({totalLeads})
              </button>
            </div>

            {/* Search and Action */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: "450px", justifyContent: "flex-end" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "250px" }}>
                <input 
                  type="text" 
                  placeholder={activeTab === "scans" ? "Search sites..." : "Name, email, site..."}
                  className="input-large"
                  style={{ 
                    padding: "0.5rem 1rem 0.5rem 2.25rem", 
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "100%"
                  }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
              </div>
              
              {activeTab === "leads" && totalLeads > 0 && (
                <a 
                  href="/api/admin/export" 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    padding: "0.55rem 1rem", 
                    borderRadius: "8px", 
                    backgroundColor: "#10b981", 
                    color: "#fff", 
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
                  }}
                >
                  <Download size={16} />
                  <span>Export CSV</span>
                </a>
              )}
            </div>
          </div>

          {/* Table Content */}
          <div style={{ overflowX: "auto" }}>
            {isLoadingData ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5rem" }}>
                <Loader2 size={36} className="animate-spin" style={{ color: "var(--primary)", marginBottom: "1rem" }} />
                <p style={{ opacity: 0.6 }}>Loading...</p>
              </div>
            ) : activeTab === "scans" ? (
              // --- SCANS TAB ---
              filteredReports.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem", opacity: 0.5 }}>
                  <Database size={48} style={{ marginBottom: "1rem" }} />
                  <p>No scan data found.</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)", backgroundColor: "rgba(0,0,0,0.02)" }}>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Website</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Score</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>AI Discoverability Risk</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Date</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, idx) => {
                      const riskColor = getRiskColor(report.ai_discoverability_risk);
                      return (
                        <tr key={report.id || idx} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="table-row">
                          <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>
                            <a href={report.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                              {new URL(report.url).hostname}
                            </a>
                          </td>
                          <td style={{ padding: "1rem 1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ 
                                display: "inline-block", 
                                width: "10px", 
                                height: "10px", 
                                borderRadius: "50%", 
                                backgroundColor: getScoreColor(report.overall_score) 
                              }}></span>
                              <span style={{ fontWeight: "bold" }}>{report.overall_score}/100</span>
                            </div>
                          </td>
                          <td style={{ padding: "1rem 1.5rem" }}>
                            <span style={{ 
                              padding: "0.25rem 0.6rem", 
                              borderRadius: "4px", 
                              fontSize: "0.8rem", 
                              fontWeight: "bold",
                              backgroundColor: riskColor.bg,
                              color: riskColor.text
                            }}>
                              {report.ai_discoverability_risk}
                            </span>
                          </td>
                          <td style={{ padding: "1rem 1.5rem", opacity: 0.7 }}>
                            {report.created_at ? new Date(report.created_at).toLocaleDateString("en-US", { 
                              day: "2-digit", 
                              month: "2-digit", 
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            }) : "-"}
                          </td>
                          <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                            <button 
                              onClick={() => window.open(`/report/${report.id}`, "_blank")}
                              style={{ 
                                display: "inline-flex", 
                                alignItems: "center", 
                                gap: "0.25rem", 
                                color: "var(--primary)", 
                                fontWeight: 600,
                                fontSize: "0.9rem" 
                              }}
                            >
                              <span>Details</span>
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            ) : (
              // --- LEADS TAB ---
              filteredLeads.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem", opacity: 0.5 }}>
                  <Users size={48} style={{ marginBottom: "1rem" }} />
                  <p>No leads captured yet.</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)", backgroundColor: "rgba(0,0,0,0.02)" }}>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Full Name</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Email</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Scanned Site</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Captured Date</th>
                      <th style={{ padding: "1rem 1.5rem", fontWeight: 600, textAlign: "right" }}>Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, idx) => (
                      <tr key={lead.id || idx} style={{ borderBottom: "1px solid var(--border)" }} className="table-row">
                        <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>
                          {lead.first_name} {lead.last_name}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <a href={`mailto:${lead.email}`} style={{ color: "var(--primary)", textDecoration: "underline" }}>
                            {lead.email}
                          </a>
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          {lead.url ? (
                            <a href={lead.url} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.8 }}>
                              {new URL(lead.url).hostname}
                            </a>
                          ) : (
                            <span style={{ opacity: 0.5 }}>Unknown</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", opacity: 0.7 }}>
                          {new Date(lead.created_at).toLocaleDateString("en-US", { 
                            day: "2-digit", 
                            month: "2-digit", 
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                          {lead.report_id ? (
                            <button 
                              onClick={() => window.open(`/report/${lead.report_id}`, "_blank")}
                              style={{ 
                                display: "inline-flex", 
                                alignItems: "center", 
                                gap: "0.25rem", 
                                color: "var(--primary)", 
                                fontWeight: 600,
                                fontSize: "0.9rem" 
                              }}
                            >
                              <span>View</span>
                              <ChevronRight size={16} />
                            </button>
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>

      </div>
      <style jsx global>{`
        .table-row:hover {
          background-color: rgba(65, 105, 225, 0.03) !important;
        }
        .logout-btn:hover {
          background-color: #fee2e2 !important;
        }
      `}</style>
    </div>
  );
}
