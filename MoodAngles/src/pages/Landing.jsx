import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ---------------- Typewriter effect ----------------
function TypeWriter({ texts, speed = 100 }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayed((prev) => prev + texts[index][charIndex]);
      if (charIndex < texts[index].length - 1) {
        setCharIndex((c) => c + 1);
      } else {
        setTimeout(() => {
          setDisplayed("");
          setCharIndex(0);
          setIndex((i) => (i + 1) % texts.length);
        }, 1500);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, index, texts, speed]);

  return <span className="typewriter">{displayed}</span>;
}

// ---------------- Floating Bubble ----------------
function Bubble({ left, size, delay }) {
  const colors = [
    "rgba(255,182,193,0.5)",
    "rgba(173,216,230,0.5)",
    "rgba(221,160,221,0.5)",
    "rgba(255,239,213,0.5)",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div
      className="bubble"
      style={{ left, width: size, height: size, backgroundColor: color, animationDelay: delay }}
    />
  );
}

// ---------------- Feature Card ----------------
function Card({ title, desc, icon }) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// ---------------- Gallery Card ----------------
function GalleryCard({ img }) {
  return (
    <div className="gallery-card">
      <img src={img} alt="MoodAngels feature" />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate(); // 👈 for routing

  const typingTexts = [
    "Welcome to MoodAngels",
    "Track your moods",
    "Visualize your progress",
    "Stay motivated daily",
  ];

  const [bubbles] = useState(
    Array.from({ length: 12 }).map(() => ({
      left: Math.random() * 100 + "%",
      size: Math.random() * 40 + 20 + "px",
      delay: Math.random() * 10 + "s",
    }))
  );

  const gallery = [
    "/images/img1.png",
    "/images/img2.png",
    "/images/img3.png",
    "/images/img4.png",
  ];

  return (
    <div>
      {/* ---------- Navigation ---------- */}
      <nav className="nav">
        <ul>
          <li>Home</li>
          <li>About Us</li>
        </ul>
      </nav>

      {/* ---------- Hero Section ---------- */}
      <section className="hero">
        <div className="gradient-bg"></div>
        {bubbles.map((b, idx) => (
          <Bubble key={idx} {...b} />
        ))}

        <div className="hero-text">
          <h1 className="hero-title">MoodAngels</h1>
          <h2>
            <TypeWriter texts={typingTexts} speed={100} />
          </h2>

          {/* Navigate to /dashboard on click */}
          <button className="cta" onClick={() => navigate("/dashboard")}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* ---------- Feature Cards ---------- */}
      <section className="cards-section">
        <h2>About MoodAngels</h2>
        <div className="cards-container">
          <Card
            title="Track Your Mood"
            desc="Quickly log your daily moods and see patterns emerge over time."
            icon="😊"
          />
          <Card
            title="Visualize Trends"
            desc="Interactive charts help you understand your mood patterns clearly."
            icon="📊"
          />
          <Card
            title="Stay Motivated"
            desc="Set goals, reminders, and improve your emotional well-being."
            icon="🌟"
          />
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section className="gallery-section">
        <h2>Gallery</h2>
        <p>Here are a few features of MoodAngels</p>
        <div className="gallery-wrapper">
          <div className="gallery-strip">
            {gallery.concat(gallery).map((img, idx) => (
              <GalleryCard key={idx} img={img} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <p>&copy; 2025 MoodAngels. All rights reserved.</p>
      </footer>

      {/* ---------- Styles ---------- */}
      <style>{`
        /* Navigation */
        .nav { position: fixed; top: 0; right: 0; padding: 20px 40px; z-index: 100; }
        .nav ul { display: flex; gap: 30px; list-style: none; margin: 0; padding: 0; }
        .nav li { cursor: pointer; font-weight: 500; position: relative; }
        .nav li::after { content: ""; position: absolute; left: 0; bottom: -5px; width: 0%; height: 2px; background: black; transition: width 0.3s; }
        .nav li:hover::after { width: 100%; }

        /* Hero */
        .hero { position: relative; min-height: 100vh; display: flex; justify-content: center; align-items: center; overflow: hidden; text-align: center; }
        .gradient-bg { position: absolute; width: 200%; height: 200%; background: linear-gradient(45deg, #ffe0e9, #d0f0ff, #d0ffe0, #e6e6fa); background-size: 400% 400%; animation: gradientFlow 20s ease infinite; z-index: 0; }
        @keyframes gradientFlow { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
        .hero-text { position: relative; z-index: 10; color: #333; }
        .hero-title { font-size: 4rem; font-weight: 900; color: navy; text-shadow: 0 0 15px rgba(0,0,128,0.3); margin-bottom: 20px; }
        .typewriter { font-size: 1.5rem; border-right: 2px solid black; padding-right: 5px; animation: blink 1s infinite; }
        @keyframes blink { 0%,50%,100%{border-color:black;} 25%,75%{border-color:transparent;} }
        .cta { margin-top: 20px; padding: 12px 30px; border: none; background: navy; color: white; font-size: 1.2rem; border-radius: 30px; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
        .cta:hover { transform: scale(1.05); box-shadow: 0 5px 15px rgba(0,0,128,0.4); }

        /* Bubbles */
        .bubble { position: absolute; bottom: -50px; border-radius: 50%; animation: rise 20s linear infinite; filter: blur(3px); }
        @keyframes rise { 0%{transform:translateY(0) scale(1);opacity:0;} 20%{opacity:1;} 100%{transform:translateY(-120vh) scale(1.3);opacity:0;} }

        /* Feature Cards */
        .cards-section { padding: 60px 20px 40px; background-color: white; text-align: center; }
        .cards-section h2 { font-size: 2.5rem; margin-bottom: 40px; }
        .cards-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
        .card { background: linear-gradient(135deg, #d0f0ff, #ffe0e9); padding: 30px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 250px; transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-10px); box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
        .card-icon { font-size: 2rem; margin-bottom: 10px; }

        /* Gallery */
        .gallery-section { padding: 80px 20px; background: #f3f1f1ff; text-align: center; color: #b56576; font-family: "Allura", cursive; }
        .gallery-section h2 { font-size: 2.5rem; margin-bottom: 10px; font-weight: 700; font-family: "Allura", cursive; }
        .gallery-section p { font-size: 1.2rem; opacity: 0.85; margin-bottom: 40px; font-family: "Poppins", sans-serif; }
        .gallery-wrapper { overflow: hidden; width: 100%; position: relative; margin-top: 30px; border-radius: 20px; border: 2px solid #bbbbbbff; background: #b5a8a8ff; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .gallery-strip { display: flex; gap: 20px; animation: scroll-left 25s linear infinite; padding: 20px; }
        .gallery-wrapper:hover .gallery-strip { animation-play-state: paused; }
        @keyframes scroll-left { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
        .gallery-card { flex: 0 0 400px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .gallery-card img { width: 100%; height: 350px; object-fit: cover; display: block; }

        /* Footer */
        .footer { background-color: #222; color: #fff; text-align: center; padding: 20px; }
      `}</style>
    </div>
  );
}
