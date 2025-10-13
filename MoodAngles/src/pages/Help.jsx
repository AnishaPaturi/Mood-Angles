import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserWrapper from "../components/UserWrapper";
import { ChevronDown, ChevronUp } from "lucide-react";

function Help() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How do I take a mood test?",
      a: (
        <>
          Go to the <Link to="/mood-test" className="faq-link">Mood Test section</Link>, select the test type, and follow the prompts. Make sure you are in a calm environment for accurate results.
        </>
      ),
    },
    {
      q: "How can I understand my results?",
      a: (
        <>
          After completing a test, you’ll see a detailed analysis including mood scores and suggestions for improvement. For guidance, visit <Link to="/results-guide" className="faq-link">this guide</Link>.
        </>
      ),
    },
    {
      q: "How do I contact a professional?",
      a: (
        <>
          You can reach out via our <Link to="/contact" className="faq-link">Contact section</Link>, which allows direct messaging or scheduling appointments with certified professionals.
        </>
      ),
    },
    {
      q: "How do I manage my profile and settings?",
      a: (
        <>
          Go to your <Link to="/dashboard" className="faq-link">Dashboard → Profile</Link> to update personal info, notifications, and privacy settings.
        </>
      ),
    },
    {
      q: "Where can I learn more about mental wellness?",
      a: (
        <>
          Check out the <a href="https://www.mentalhealth.org.uk" target="_blank" rel="noopener noreferrer" className="faq-link">Mental Health Foundation</a> for trusted resources.
        </>
      ),
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const css = `
    .help-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding-bottom: 3rem;
      padding-top: 2rem;
    }

    .help-card {
      background: rgba(245, 250, 255, 0.9);
      backdrop-filter: blur(12px);
      border-radius: 1.5rem;
      padding: 2rem;
      max-width: 720px;
      width: 100%;
      box-shadow: 0 12px 35px rgba(200,200,220,0.25);
      border: 1px solid rgba(255,255,255,0.6);
      transition: all 0.3s ease;
    }

    .help-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 45px rgba(200,200,220,0.3);
    }

    h1 {
      text-align: center;
      color: #5b5b7a;
    }

    p.intro {
      text-align: center;
      color: #555;
      margin-bottom: 1.5rem;
    }

    .faq-item {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      margin-bottom: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .faq-item:hover {
      background: rgba(240, 248, 255, 0.9);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(180,180,200,0.15);
    }

    .faq-question {
      font-weight: 600;
      color: #6b6b8f;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;
    }

    .faq-answer {
      margin-top: 0.6rem;
      font-size: 0.95rem;
      color: #4c4c6b;
      line-height: 1.5;
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.4s ease;
    }

    .faq-answer.open {
      max-height: 300px;
      opacity: 1;
    }

    .faq-icon {
      color: #7b7bbf;
    }

    .faq-link {
      color: #7b7bbf;
      font-weight: 500;
      text-decoration: underline;
    }

    .faq-link:hover {
      color: #5b5ba0;
    }
  `;

  return (
    <UserWrapper>
      <div className="help-section">
        <h1>🆘 Help & FAQs</h1>
        <p className="intro">
          Welcome to the Help Center! Find answers to common questions and guidance on using MoodAngels effectively.
        </p>

        <div className="help-card">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" onClick={() => toggleFAQ(i)}>
              <div className="faq-question">
                {faq.q}
                <span className="faq-icon">
                  {openFAQ === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
              <div className={`faq-answer ${openFAQ === i ? "open" : ""}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{css}</style>
    </UserWrapper>
  );
}

export default Help;
