"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  date: string;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const userSession = localStorage.getItem("cricnova_user") || localStorage.getItem("isLoggedIn");
    if (userSession) {
      setIsLoggedIn(true);
    }

    const savedNews = localStorage.getItem("cricnova_news");
    if (savedNews) {
      setNewsList(JSON.parse(savedNews));
    } else {
      const defaultNews: NewsItem[] = [
        {
          id: "1",
          title: "CricNova Official Launch",
          content: "Welcome to CricNova, your ultimate platform for local cricket scoring and professional broadcasting.",
          date: "16 Oct 2026"
        }
      ];
      setNewsList(defaultNews);
      localStorage.setItem("cricnova_news", JSON.stringify(defaultNews));
    }
  }, []);

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Only logged-in users can publish news!");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content!");
      return;
    }

    const newItem: NewsItem = {
      id: "news_" + Date.now(),
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    };

    const updated = [newItem, ...newsList];
    setNewsList(updated);
    localStorage.setItem("cricnova_news", JSON.stringify(updated));

    setTitle("");
    setContent("");
    setImageUrl("");
    setVideoUrl("");
    setShowModal(false);
  };

  return (
    <div style={{ background: "#050811", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 5px 0" }}>Cricket News & Updates</h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Latest announcements, match reports, and highlights.</p>
          </div>

          {isLoggedIn ? (
            <button
              onClick={() => setShowModal(true)}
              style={{ background: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
            >
              + Add News Post
            </button>
          ) : (
            <div style={{ color: "#64748b", fontSize: "13px", fontStyle: "italic" }}>
              Login to post news
            </div>
          )}
        </div>

        {/* News Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {newsList.map((item) => (
            <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "12px", color: "#f97316", fontWeight: 700, marginBottom: "8px" }}>{item.date}</div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 10px 0" }}>{item.title}</h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", margin: "0 0 15px 0" }}>{item.content}</p>

              {item.imageUrl && (
                <div style={{ marginBottom: "15px", borderRadius: "8px", overflow: "hidden", border: "1px solid #334155" }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: "100%", maxHeight: "350px", objectFit: "cover", display: "block" }} />
                </div>
              )}

              {item.videoUrl && (
                <div style={{ marginBottom: "15px", borderRadius: "8px", overflow: "hidden", border: "1px solid #334155", background: "#000" }}>
                  <iframe src={item.videoUrl} title={item.title} style={{ width: "100%", height: "320px", border: "none" }} allowFullScreen></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && isLoggedIn && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "14px", width: "500px", padding: "25px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>Create News Post</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}>X</button>
            </div>

            <form onSubmit={handleCreateNews}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 700 }}>NEWS TITLE</label>
                <input type="text" placeholder="Enter headline..." value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 700 }}>CONTENT / DESCRIPTION</label>
                <textarea placeholder="Write full news details..." rows={4} value={content} onChange={(e) => setContent(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px", resize: "vertical" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 700 }}>IMAGE URL (Optional)</label>
                <input type="url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ width: "100%", padding: "10px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }} />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 700 }}>VIDEO URL / EMBED LINK (Optional)</label>
                <input type="url" placeholder="https://www.youtube.com/embed/..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ width: "100%", padding: "10px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: "#334155", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#ef4444", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>Publish News</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}