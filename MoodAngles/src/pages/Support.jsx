import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

function Support() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Updated working handleSubmit (connects to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert(data.error || "Failed to send feedback. Please try again later.");
      }
    } catch (error) {
      console.error("❌ Feedback submission error:", error);
      alert("⚠️ Unable to send feedback. Please check your connection or try again later.");
    }

    setLoading(false);
  };

  const faqs = [
    { q: "How soon can I expect a response?", a: "Our team typically replies within 24 hours. For urgent matters, you can reach us via Discord or email." },
    { q: "Is there a community I can talk to?", a: "Yes! You can join our Discord or Forum to connect with others and share your journey." },
    { q: "Can I get help anonymously?", a: "Absolutely. You can reach out without revealing personal information — privacy is a priority for us." },
    { q: "What is your privacy policy regarding messages?", a: "We treat all communications with the highest level of confidentiality. Messages are encrypted and never shared with third parties." },
    { q: "How is the MoodAngles platform kept secure?", a: "We use industry-standard encryption protocols (like HTTPS) and secure login procedures to protect your data and account." },
  ];

  const css = `
    .support-page {
      min-height: 100vh;
      background: linear-gradient(to bottom right, #f3e8ff, #e9d5ff, #d8b4fe);
      padding: 3rem 1rem;
      font-family: 'Poppins', sans-serif;
      color: #4b5563;
    }

    .support-header {
      max-width: 900px;
      margin: 0 auto 2rem;
      text-align: center;
    }

    .support-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #5b21b6;
      margin-bottom: 0.5rem;
    }

    .support-header p {
      color: #374151;
      font-size: 1rem;
    }

    .feedback-card {
      max-width: 900px;
      margin: 0 auto 3rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px rgba(107, 33, 168, 0.15);
      border: 1px solid #f3e8ff;
    }

    .feedback-card h2 {
      text-align: center;
      color: #6b21a8;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .feedback-card form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feedback-card input,
    .feedback-card textarea {
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
    }

    .feedback-card input:focus,
    .feedback-card textarea:focus {
      outline: none;
      border-color: #a855f7;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
    }

    .success-msg {
      color: #16a34a;
      text-align: center;
      font-weight: 500;
    }

    .submit-btn {
      background-color: #7e22ce;
      color: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 3px 8px rgba(126, 34, 206, 0.3);
    }

    .submit-btn:hover {
      background-color: #6b21a8;
      box-shadow: 0 6px 14px rgba(126, 34, 206, 0.4);
    }

    .submit-btn:disabled {
      background-color: #9b6dce;
      cursor: not-allowed;
      opacity: 0.7;
    }

    .faq-section {
      max-width: 900px;
      margin: 0 auto 3rem;
      text-align: center;
    }

    .faq-section h2 {
      color: #5b21b6;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .faq-item {
      background: rgba(255,255,255,0.9);
      border: 1px solid #f3e8ff;
      border-radius: 1rem;
      box-shadow: 0 8px 20px rgba(91, 33, 182, 0.1);
      margin-bottom: 1rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .faq-question {
      width: 100%;
      background: transparent;
      border: none;
      text-align: left;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 1.1rem;
      color: #1f2937;
      font-weight: 600;
      transition: background 0.3s ease;
    }

    .faq-question:hover {
      background-color: #faf5ff;
    }

    .faq-answer {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      padding: 0 1.5rem;
      color: #4b5563;
      text-align: left;
    }

    .faq-answer.open {
      max-height: 200px;
      opacity: 1;
      padding-bottom: 1rem;
    }

    .community-section {
      max-width: 900px;
      margin: 0 auto 3rem;
      text-align: center;
    }

    .community-section h2 {
      font-size: 1.5rem;
      color: #5b21b6;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .community-section p {
      color: #4b5563;
      margin-bottom: 1rem;
    }

    .community-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .community-links a {
      background: rgba(255,255,255,0.8);
      border: 1px solid #e9d5ff;
      color: #7e22ce;
      padding: 0.6rem 1.5rem;
      border-radius: 0.75rem;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 3px 8px rgba(126, 34, 206, 0.1);
    }

    .community-links a:hover {
      background-color: #faf5ff;
      box-shadow: 0 5px 12px rgba(126, 34, 206, 0.25);
    }

    footer {
      text-align: center;
      color: #6b7280;
      font-size: 0.9rem;
      border-top: 1px solid #d1d5db;
      padding: 1rem 0;
    }

    footer p:last-child {
      color: #9ca3af;
    }
  `;

  return (
    <div className="support-page">
      <div className="support-header">
        <h1>💬 Community Support</h1>
        <p>Need help, guidance, or just someone to listen? We’re here for you. Reach out anytime and we’ll do our best to assist.</p>
      </div>

      {/* Feedback Form */}
      <div className="feedback-card">
        <h2>Feedback</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <textarea name="message" rows="4" placeholder="Type your message..." value={formData.message} onChange={handleChange} required></textarea>

          {submitted && <p className="success-msg">✅ Message Sent Successfully!</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="faq-question">
              <span>{faq.q}</span>
              {openFAQ === i ? <Minus color="#7e22ce" size={20} /> : <Plus color="#7e22ce" size={20} />}
            </button>
            <div className={`faq-answer ${openFAQ === i ? "open" : ""}`}>
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Community Section */}
      <div className="community-section">
        <h2>Join Our Community 🌐</h2>
        <p>Connect with others, share experiences, or seek help through our safe and supportive spaces.</p>
        <div className="community-links">
          <a href="https://discord.gg/4gKsmdYz" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://discord.com/channels/1435685956484337676/1435687137776242921" target="_blank" rel="noopener noreferrer">Forum</a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=moodangles05@gmail.com" target="_blank" rel="noopener noreferrer">Email Us</a>
        </div>
      </div>

      <footer>
        <p>© {new Date().getFullYear()} MoodAngles. All rights reserved.</p>
        <p>Made with 💜 by the MoodAngles Team</p>
      </footer>

      <style>{css}</style>
    </div>
  );
}

export default Support;
