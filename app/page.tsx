"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [hooks, setHooks] = useState<string[]>([]);
  const [summary, setSummary] = useState("");

  async function onGenerate() {
    if (!url.trim()) return;

    setStatus("loading");
    setHooks([]);
    setSummary("");

    // TEMP: fake results (we'll replace with real AI next)
    await new Promise((r) => setTimeout(r, 600));

    setSummary(
      "Summary (placeholder): This link is about a topic that creators can quickly repackage into short-form content."
    );
    setHooks([
      "Hook 1: I didn’t realize THIS is why everyone’s talking about it…",
      "Hook 2: The real reason this matters (and nobody explains it clearly)",
      "Hook 3: If you’re still doing it the old way, you’re already behind",
      "Hook 4: Here’s the 10-second version so you can post today",
      "Hook 5: I tested it so you don’t have to — here’s what happened",
    ]);

    setStatus("done");
  }

  function onClear() {
    setUrl("");
    setHooks([]);
    setSummary("");
    setStatus("idle");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #111 0%, #000 55%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        padding: "48px 20px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      }}
    >
      <div style={{ width: "100%", maxWidth: 880 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)",
            }}
          />
          <div>
            <h1 style={{ fontSize: 40, margin: 0, lineHeight: 1.1 }}>
              PostPal
            </h1>
            <p style={{ margin: "6px 0 0", opacity: 0.7 }}>
              Paste a link → get hooks, a summary, and a script outline.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <label style={{ display: "block", fontSize: 14, opacity: 0.8 }}>
            Link
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube, TikTok, article, tweet thread, etc."
              style={{
                flex: "1 1 420px",
                padding: "12px 14px",
                fontSize: 16,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
                outline: "none",
              }}
            />

            <button
              onClick={onGenerate}
              disabled={status === "loading" || !url.trim()}
              style={{
                padding: "12px 16px",
                fontSize: 16,
                borderRadius: 12,
                border: "none",
                cursor:
                  status === "loading" || !url.trim() ? "not-allowed" : "pointer",
                background:
                  status === "loading" || !url.trim()
                    ? "rgba(255,255,255,0.12)"
                    : "linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)",
                color: "black",
                fontWeight: 700,
                minWidth: 140,
              }}
            >
              {status === "loading" ? "Generating…" : "Generate"}
            </button>

            <button
              onClick={onClear}
              style={{
                padding: "12px 16px",
                fontSize: 16,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                cursor: "pointer",
                background: "transparent",
                color: "white",
                opacity: 0.9,
              }}
            >
              Clear
            </button>
          </div>

          <p style={{ margin: "12px 0 0", fontSize: 13, opacity: 0.6 }}>
            This is a placeholder generator right now. Next step: real AI output.
          </p>
        </div>

        {status !== "idle" && (
          <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
            <div
              style={{
                padding: 18,
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>Summary</h2>
              <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.5 }}>
                {status === "loading" ? "Working…" : summary}
              </p>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>Hooks</h2>

              {status === "loading" ? (
                <p style={{ margin: "10px 0 0", opacity: 0.7 }}>Generating…</p>
              ) : (
                <ol style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                  {hooks.map((h, i) => (
                    <li key={i} style={{ margin: "10px 0", opacity: 0.9 }}>
                      {h}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>Script Outline</h2>
              <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.6 }}>
                <div>1) Hook (1 line)</div>
                <div>2) Context (2–3 lines)</div>
                <div>3) Key point / twist (1–2 lines)</div>
                <div>4) Quick takeaway (1 line)</div>
                <div>5) CTA (comment / follow / save)</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 26, opacity: 0.5, fontSize: 12 }}>
          PostPal v0 — shipped. Next: real AI endpoint.
        </div>
      </div>
    </main>
  );
}
