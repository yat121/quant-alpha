"use client";
import { useEffect } from "react";

export default function Sidebar() {
  useEffect(() => {
    const path = window.location.pathname;
    document.querySelectorAll(".nav-item").forEach(el => {
      el.classList.toggle("active", el.getAttribute("href") === path);
    });
    document.querySelectorAll(".nav-item").forEach(el => {
      el.addEventListener("click", () => {
        document.getElementById("sidebar")?.classList.remove("open");
      });
    });
  }, []);

  return (
    <>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-logo">📊 Quant-Alpha</div>
        <nav>
          <a href="/" className="nav-item">🏠 Dashboard</a>
          <a href="/backtests" className="nav-item">📈 Backtests</a>
          <a href="/strategies" className="nav-item">⚙️ Strategies</a>
          <a href="/live" className="nav-item">🔴 Live</a>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", padding: "0 12px" }}>
            v1.0.0 · Powered by VV
          </div>
        </div>
      </aside>

      <button
        className="hamburger"
        onClick={() => document.getElementById("sidebar")?.classList.toggle("open")}
      >
        ☰
      </button>
    </>
  );
}
