import React, { useState } from "react";
import UserWrapper from "../components/UserWrapper";

const Articles = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const articles = [
    {
      title: "Caring for Your Mind",
      description:
        "Learn gentle ways to restore emotional balance and care for your mental health every day.",
      details:
        "Taking care of your mind begins with small, intentional acts — like pausing to breathe, journaling your thoughts, or simply doing something you enjoy. Rest is not a reward; it’s essential for healing and focus. Your mind deserves compassion too, not just your body.",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Mindful Mornings",
      description:
        "Simple mindfulness rituals to start your day feeling grounded and calm.",
      details:
        "Mindful mornings aren’t about long meditation sessions — they’re about awareness. Try opening your day with gratitude, avoiding screens for the first 10 minutes, and taking time to notice your breath. A calm start often leads to a balanced day.",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Small Acts of Self-Love",
      description:
        "Tiny daily habits that can make a huge difference in how you feel about yourself.",
      details:
        "Self-love doesn’t mean ignoring flaws — it means embracing them. Compliment yourself. Forgive your past mistakes. Treat your body gently. Even 5 minutes spent caring for yourself intentionally builds resilience and confidence.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    },
  ];

  const tips = [
    {
      emoji: "☀️",
      text: "Start your morning with gratitude — list three small things that make you smile.",
    },
    {
      emoji: "💧",
      text: "Stay hydrated. Water helps both your mind and body stay energized and focused.",
    },
    {
      emoji: "🌿",
      text: "Take nature breaks — even five minutes outside can refresh your mood.",
    },
    {
      emoji: "🎧",
      text: "Listen to calming music or podcasts that inspire and ground you.",
    },
    {
      emoji: "💬",
      text: "Talk kindly to yourself. Replace 'I can’t' with 'I’m learning to.'",
    },
  ];

  const newsLinks = [
    {
      title: "WHO launches global mental health initiative",
      link: "https://www.who.int/news",
    },
    {
      title: "The rise of mental health awareness post-pandemic",
      link: "https://www.bbc.com/news/health",
    },
    {
      title: "New research links exercise to improved mental health",
      link: "https://www.theguardian.com/society/mental-health",
    },
    {
      title: "How schools are prioritizing emotional wellbeing",
      link: "https://edition.cnn.com/health",
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <UserWrapper>
      <div className="articles-container">
        <style>{`
          .articles-container {
            padding: 50px 20px;
            background-color: #fafafa;
            font-family: 'Poppins', sans-serif;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
          }

          .section-title {
            font-size: 2rem;
            margin-bottom: 25px;
            color: #2b2b2b;
            text-align: center;
          }

          .article-list {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .article-card {
            display: flex;
            background: #fff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
          }

          .article-card:hover {
            transform: translateY(-5px);
          }

          .article-card img {
            width: 180px;
            height: 140px;
            object-fit: cover;
          }

          .article-text {
            padding: 18px 20px;
            flex: 1;
          }

          .article-text h3 {
            margin-bottom: 8px;
            font-size: 1.3rem;
            color: #1e293b;
          }

          .article-text p {
            font-size: 0.95rem;
            color: #555;
            margin-bottom: 10px;
            line-height: 1.5;
          }

          .read-more {
            text-decoration: none;
            color: #3b82f6;
            font-weight: 500;
            cursor: pointer;
          }

          .read-more:hover {
            text-decoration: underline;
          }

          .details {
            margin-top: 10px;
            background: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            color: #444;
            font-size: 0.95rem;
            line-height: 1.6;
          }

          .tips-section {
            background: linear-gradient(135deg, #e0f2fe, #fef9c3);
            border-radius: 14px;
            padding: 35px;
            margin-top: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          .tips-section h3 {
            font-size: 1.5rem;
            color: #1e3a8a;
            margin-bottom: 20px;
            text-align: center;
          }

          .tips-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .tip-item {
            background: #fff;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            font-size: 1rem;
            transition: transform 0.2s ease;
          }

          .tip-item:hover {
            transform: scale(1.02);
          }

          .tip-item span {
            font-size: 1.4rem;
            margin-right: 12px;
          }

          .newsletter-section {
            margin-top: 60px;
            padding: 40px 30px;
            background: linear-gradient(135deg, #dbeafe, #f3f4f6);
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 6px 18px rgba(0,0,0,0.05);
          }

          .newsletter-section h2 {
            font-size: 1.8rem;
            color: #1e3a8a;
            margin-bottom: 10px;
          }

          .newsletter-section p {
            font-size: 1rem;
            color: #334155;
            margin-bottom: 25px;
          }

          .news-list {
            list-style: none;
            padding: 0;
            margin: 0 auto;
            max-width: 600px;
            text-align: left;
          }

          .news-list li {
            background: #fff;
            margin: 12px 0;
            padding: 14px 18px;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }

          .news-list li:hover {
            transform: scale(1.02);
          }

          .news-list a {
            text-decoration: none;
            color: #1d4ed8;
            font-weight: 500;
          }

          .news-list a:hover {
            text-decoration: underline;
          }

          @media (max-width: 700px) {
            .article-card {
              flex-direction: column;
              text-align: center;
            }

            .article-card img {
              width: 100%;
              height: 180px;
            }

            .article-text {
              padding: 15px;
            }
          }
        `}</style>

        {/* Articles Section */}
        <section>
          <h2 className="section-title">Articles & Guides 🌼</h2>
          <div className="article-list">
            {articles.map((article, index) => (
              <div className="article-card" key={index}>
                <img src={article.image} alt={article.title} />
                <div className="article-text">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <span
                    className="read-more"
                    onClick={() => toggleExpand(index)}
                  >
                    {expandedIndex === index ? "Show Less ↑" : "Read More →"}
                  </span>
                  {expandedIndex === index && (
                    <div className="details">{article.details}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Self Care Section */}
        <section className="tips-section">
          <h3>🌿 Daily Self-Care Rituals</h3>
          <div className="tips-list">
            {tips.map((tip, i) => (
              <div key={i} className="tip-item">
                <span>{tip.emoji}</span> {tip.text}
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <h2>🧠 Mental Health Newsletter</h2>
          <p>
            Stay informed with the latest updates, breakthroughs, and inspiring
            stories from the world of mental wellness.
          </p>
          <ul className="news-list">
            {newsLinks.map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </UserWrapper>
  );
};

export default Articles;
