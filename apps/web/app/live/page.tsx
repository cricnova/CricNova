"use client";

import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

export default function LivePage() {
  const { t } = useLanguage();

  return (
    <main className="home" style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span></span> {t("LIVE LOCAL CRICKET", "लाइव लोकल क्रिकेट")}
          </div>
          <h1 style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "15px", color: "#fff" }}>
            {t("Live", "लाइव")} <span style={{ color: "#ff3848" }}>{t("Matches.", "मैचेस।")}</span>
          </h1>
          <p style={{ color: "#888", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
            {t(
              "Track every ball live, monitor player performances, and follow real-time match scores seamlessly.",
              "हर गेंद को लाइव ट्रैक करें, खिलाड़ियों के प्रदर्शन पर नजर रखें और रियल-टाइम मैच स्कोर देखें।"
            )}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <div className="live-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>●</span> {t("NO MATCH", "कोई मैच नहीं")}
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "80px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
          <p style={{ color: "#777", fontSize: "16px" }}>
            {t(
              "No live matches available right now. Create a new match to start scoring.",
              "अभी कोई लाइव मैच उपलब्ध नहीं है। स्कोरिंग शुरू करने के लिए एक नया मैच बनाएं।"
            )}
          </p>
        </div>
      </div>
    </main>
  );
}