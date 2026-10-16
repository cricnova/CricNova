"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTournamentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      setMessage("Tournament ka naam daalo!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, logoUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/tournaments");
      } else {
        setMessage("Error: " + (data.error || "Tournament create nahi hua"));
        setLoading(false);
      }
    } catch (err) {
      setMessage("Error: Could not connect to server");
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .ct-page {
          min-height: 100vh;
          color: #ffffff;
          background:
            radial-gradient(circle at 10% 15%, rgba(150, 0, 20, 0.28), transparent 32%),
            radial-gradient(circle at 90% 10%, rgba(100, 0, 20, 0.18), transparent 30%),
            linear-gradient(135deg, #090304 0%, #120608 45%, #050203 100%);
        }

        .ct-container {
          width: min(700px, 100%);
          margin: 0 auto;
          padding: 55px 7% 90px;
        }

        .ct-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
          color: #ff4655;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .ct-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff3045;
          box-shadow: 0 0 14px rgba(255, 48, 69, 0.9);
        }

        .ct-title {
          margin: 0 0 12px;
          font-size: clamp(38px, 5vw, 56px);
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 900;
        }

        .ct-title span {
          background: linear-gradient(90deg, #ff4655, #ff7925);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ct-description {
          margin: 16px 0 40px;
          color: #918585;
          font-size: 15px;
          line-height: 1.7;
        }

        .ct-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(145deg, rgba(65, 32, 37, 0.72), rgba(20, 8, 10, 0.94));
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), inset 0 1px rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px);
          padding: 32px;
          border-radius: 30px;
        }

        .ct-section { margin-bottom: 22px; }

        .ct-label {
          display: block;
          margin-bottom: 9px;
          font-size: 11px;
          color: #918585;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .ct-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(10, 3, 5, 0.7);
          color: #fff;
          font-size: 15px;
        }

        .ct-logo-preview {
          width: 90px;
          height: 90px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 14px;
          font-size: 30px;
        }

        .ct-logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ct-file-label {
          display: inline-block;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.045);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .ct-submit-btn {
          width: 100%;
          padding: 18px;
          border-radius: 15px;
          border: none;
          background: linear-gradient(135deg, #ff2538, #ff3e4c);
          box-shadow: 0 8px 25px rgba(255, 30, 50, 0.25);
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          margin-top: 10px;
        }

        .ct-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ct-message {
          margin-top: 20px;
          padding: 15px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
          font-size: 14px;
        }
      `}</style>

      <main className="ct-page">
        <Navbar />

        <div className="ct-container">
          <div className="ct-eyebrow">
            <span className="ct-dot" />
            NEW TOURNAMENT
          </div>

          <h1 className="ct-title">
            Create <span>Tournament.</span>
          </h1>

          <p className="ct-description">
            Tournament ka naam, location aur logo daalo — matches iske andar
            organize kar sakoge.
          </p>

          <div className="ct-card">
            <div className="ct-section">
              <label className="ct-label">Tournament Name</label>
              <input
                className="ct-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Local Premier League"
              />
            </div>

            <div className="ct-section">
              <label className="ct-label">Location</label>
              <input
                className="ct-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Muzaffarpur, Bihar"
              />
            </div>

            <div className="ct-section" style={{ marginBottom: 0 }}>
              <label className="ct-label">Tournament Logo</label>
              <div className="ct-logo-preview">
                {logoUrl ? <img src={logoUrl} alt="logo" /> : "🏆"}
              </div>
              <label className="ct-file-label">
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <button
              className="ct-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tournament"}
            </button>

            {message && <div className="ct-message">{message}</div>}
          </div>
        </div>
      </main>
    </>
  );
}