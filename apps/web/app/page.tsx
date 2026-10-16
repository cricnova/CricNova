"use client";

import Navbar from "./components/Navbar";
import { useLanguage } from "./context/LanguageContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Check ki user logged-in hai ya nahi
  const handleProtectedAction = (targetPath: string) => {
    const savedUser = localStorage.getItem("cricnova_user");
    if (!savedUser) {
      alert(t("Please Sign In first to access this feature!", "इस फीचर का उपयोग करने के लिए कृपया पहले साइन इन करें!"));
      router.push("/signin");
    } else {
      router.push(targetPath);
    }
  };

  return (
    <div className="main-container">
      <main style={{ background: "#f8fafc", color: "#0f172a", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <Navbar />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
          
          {/* Hero Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "50px", marginBottom: "80px" }}>
            
            <div style={{ flex: "1", minWidth: "320px", maxWidth: "600px" }}>
              <div style={{ display: "inline-block", background: "#eff6ff", color: "#2563eb", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 800, marginBottom: "20px", textTransform: "uppercase" }}>
                ⚡ {t("NEXT-GEN CRICKET PLATFORM", "अगली पीढ़ी का क्रिकेट प्लेटफॉर्म")}
              </div>

              <h1 style={{ fontSize: "50px", fontWeight: 900, lineHeight: "1.15", letterSpacing: "-1.5px", marginBottom: "20px", color: "#0f172a" }}>
                {t("Smart scoring for street cricket, club matches & local tournaments.", "गली क्रिकेट, क्लब मैचों और स्थानीय टूर्नामेंटों के लिए स्मार्ट स्कोरिंग।")}
              </h1>
              
              <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6", marginBottom: "40px" }}>
                {t(
                  "Create tournaments. Add teams. Score every ball with real-time interactive dashboards and live broadcasting.",
                  "टूर्नामेंट बनाएं। टीमें जोड़ें। रियल-टाइम इंटरैक्टिव डैशबोर्ड और लाइव प्रसारण के साथ हर गेंद का स्कोर करें।"
                )}
              </p>

              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button 
                  onClick={() => handleProtectedAction("/scorer")}
                  className="hover-card" 
                  style={{ background: "#2563eb", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "14px", fontWeight: 800, fontSize: "15px", cursor: "pointer", boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)", transition: "all 0.3s ease" }}
                >
                  ⚡ {t("Start Live Scoring", "लाइव स्कोरिंग शुरू करें")}
                </button>
                
                <button 
                  onClick={() => handleProtectedAction("/tournaments")}
                  className="hover-card" 
                  style={{ background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", padding: "14px 28px", borderRadius: "14px", fontWeight: 800, fontSize: "15px", cursor: "pointer", transition: "all 0.3s ease" }}
                >
                  🏆 {t("Create Tournament", "टूर्नामेंट बनाएं")}
                </button>
              </div>
            </div>

            {/* Interactive Floating Card */}
            <div className="hover-card" style={{ flex: "1", minWidth: "340px", maxWidth: "460px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "28px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: "11px", padding: "4px 12px", borderRadius: "20px", fontWeight: 800 }}>
                  {t("LIVE MATCH", "लाइव मैच")}
                </span>
                <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 700 }}>RCB vs MI</span>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "18px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{t("RCB Innings", "आरसीबी पारी")}</span>
                  <span style={{ fontSize: "22px", fontWeight: 900, color: "#16a34a" }}>142/4 <span style={{ fontSize: "14px", color: "#64748b" }}>(14.2)</span></span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, marginBottom: "4px" }}>{t("BATTER", "बल्लेबाज")}</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>Abhi Kshyap</div>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700, marginTop: "2px" }}>42 (27)</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, marginBottom: "4px" }}>{t("BOWLER", "गेंदबाज")}</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>Hamid</div>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700, marginTop: "2px" }}>3/28</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>{t("RECENT BALLS", "हालिया गेंदें")}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["1", "4", "6", "0", "2", "W"].map((b, i) => (
                    <span key={i} style={{ width: "26px", height: "26px", borderRadius: "50%", background: b === "6" ? "#2563eb" : b === "W" ? "#ef4444" : "#e2e8f0", color: b === "6" || b === "W" ? "#fff" : "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800 }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Stats Section */}
          <div style={{ display: "flex", gap: "60px", marginBottom: "80px", borderTop: "1px solid #e2e8f0", paddingTop: "40px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "44px", fontWeight: 900, color: "#0f172a" }}>1K+</div>
              <div style={{ fontSize: "15px", color: "#64748b" }}>{t("Matches Played", "खेले गए मैच")}</div>
            </div>
            <div>
              <div style={{ fontSize: "44px", fontWeight: 900, color: "#0f172a" }}>100+</div>
              <div style={{ fontSize: "15px", color: "#64748b" }}>{t("Tournaments", "टूर्नामेंट")}</div>
            </div>
            <div>
              <div style={{ fontSize: "44px", fontWeight: 900, color: "#0f172a" }}>50+</div>
              <div style={{ fontSize: "15px", color: "#64748b" }}>{t("Active Teams", "सक्रिय टीमें")}</div>
            </div>
          </div>

          {/* Integration Cards */}
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 800, marginBottom: "30px", color: "#0f172a" }}>
              {t("Bring your scoreboard into professional tools.", "अपने स्कोरबोर्ड को प्रोफेशनल टूल्स में इंटीग्रेट करें।")}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              {[
                { name: "vMix", desc: t("Live Graphics Studio", "लाइव ग्राफिक्स स्टूडियो") },
                { name: "OBS", desc: t("Broadcasting Software", "ब्रॉडकास्टिंग सॉफ्टवेयर") },
                { name: "PRISM Live", desc: t("Mobile & PC Streaming", "मोबाइल और पीसी स्ट्रीमिंग") },
                { name: "CameraFi Live", desc: t("On-Ground Capture", "ऑन-ग्राउंड कैप्चर") }
              ].map(item => (
                <div key={item.name} className="hover-card" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "22px", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer", transition: "all 0.3s ease" }}>
                  <div style={{ width: "45px", height: "45px", background: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#2563eb", fontSize: "18px" }}>
                    {item.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{item.name}</div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}