import React, { useState } from "react";
import UserWrapper from "../components/UserWrapper";
import { useNavigate } from "react-router-dom";

const FindTherapist = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [expandedBenefit, setExpandedBenefit] = useState(null);

  const therapists = [
    {
      name: "Dr. Anay Sharma",
      specialty: "Depression & Anxiety",
      location: "Mumbai, India",
      contact: "anay@example.com",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      degree: "MBBS, MD (Psychiatry)",
      experience: "19 years",
      about: "Expert in supporting individuals with anxiety, depression, and life stressors."
    },
    {
      name: "Dr. Aisha Verma",
      specialty: "Cognitive Behavioral Therapy (CBT) & Adolescent Mental Health",
      location: "Mumbai, India",
      contact: "aisha.verma.psych@gmail.com",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      degree: "M.Phil Clinical Psychology",
      experience: "12 years",
      about: "Expert in CBT and emotional resilience development for teens and young adults."
    },
    {
      name: "Dr. Ethan Rao",
      specialty: "Neuropsychiatry & Mood Disorders",
      location: "Mumbai, India",
      contact: "ethan.rao.mindcare@outlook.com",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80",
      degree: "MBBS, DM (Neuropsychiatry)",
      experience: "10 years",
      about: "Specializes in neurological-linked mood disorders and clinical psychiatric evaluation."
    },
    {
      name: "Dr. Leena Kapoor",
      specialty: "Depression & Anxiety",
      location: "Mumbai, India",
      contact: "leena.kapoor.healspace@gmail.com",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
      degree: "M.A. Clinical Psychology, CBT Specialist",
      experience: "7 years",
      about: "Focuses on emotional well-being and healthier coping strategies for stress."
    },
    {
      name: "Dr. Rajiv Mehta",
      specialty: "ADHD & Child Therapy",
      location: "Bangalore, India",
      contact: "rajiv@example.com",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
      degree: "PhD Child Psychology",
      experience: "5 years",
      about: "Helps children with ADHD, communication challenges, and emotional regulation."
    },
    {
      name: "Dr. Neveen Kapoor",
      specialty: "Cognitive Behavioral Therapy",
      location: "Delhi, India",
      contact: "naveen@example.com",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      degree: "M.Phil Clinical Psychology, CBT Practitioner",
      experience: "6 years",
      about: "Helps clients identify negative thinking patterns & reframe them through CBT."
    }
  ];
  const benefits = [
    { title: "Emotional Support 💛", description: "Therapists provide a safe, non-judgmental space to express your feelings, reducing stress and anxiety." },
    { title: "Guidance & Tools 🛠️", description: "They teach coping strategies and mindfulness techniques to navigate life's challenges." },
    { title: "Perspective & Clarity 🌿", description: "Therapists help you understand your emotions and thought patterns for better decisions." },
    { title: "Personal Growth 🚀", description: "Regular therapy fosters self-awareness, resilience, and long-term personal growth." }
  ];

  const testimonials = [
    { name: "Amit S.", text: "Therapy helped me cope with anxiety and gave me practical tools to manage stress." },
    { name: "Rhea K.", text: "I never knew self-awareness could be so transformative. Therapy was life-changing!" },
    { name: "Sanjay P.", text: "I learned how to deal with my moods and communicate better with loved ones." },
    { name: "Aarav M.", text: "Opening up wasn’t easy, but my therapist made me feel heard for the first time." },
    { name: "Nina S.", text: "Therapy helped me find peace in my own mind — I finally feel lighter and stronger." }
  ];

  const filteredTherapists = therapists.filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialty.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  const nextTestimonial = () => setTestimonialIndex((testimonialIndex + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length);

  return (
    <UserWrapper>
      <div className="page-container">
        {/* ✅ Chatbot Button Added */}
        <button
          onClick={() => navigate("/ChatBot")}
          style={{
            display: "block",
            margin: "0 auto 25px auto",
            padding: "14px 28px",
            background: "#2563eb",
            border: "none",
            color: "white",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "0.3s"
          }}
          onMouseEnter={(e) => (e.target.style.background = "#1e3a8a")}
          onMouseLeave={(e) => (e.target.style.background = "#2563eb")}
        >
          🤖 Speak to our Virtual Mental Health Assistant
        </button>

        <style>{`
          /* General */
          .page-container {
            max-width: 1100px;
            margin: 40px auto;
            font-family: 'Poppins', sans-serif;
            color: #1f2937;
            overflow-x: hidden;
          }

          /* Mega card */
          .mega-card {
            background: #fff;
            border-radius: 30px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 60px;
          }

          /* Hero section */
          .hero {
            text-align: center;
            background: linear-gradient(120deg, #3b82f6, #06b6d4);
            color: white;
            border-radius: 20px;
            padding: 50px 20px;
            position: relative;
          }

          .hero h1 {
            font-size: 3rem;
            margin-bottom: 15px;
          }

          .hero p {
            font-size: 1.2rem;
            margin-bottom: 25px;
          }

          .search-bar {
            width: 100%;
            max-width: 500px;
            padding: 15px 20px;
            border-radius: 50px;
            border: none;
            outline: none;
            font-size: 1.1rem;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }

          .search-bar:focus {
            box-shadow: 0 12px 30px rgba(0,0,0,0.25);
          }

          /* Therapist Cards Flip */
          .therapist-list {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: center;
          }

          .card-container {
            perspective: 1200px;
            width: 280px;
          }

          .therapist-card {
            width: 100%;
            height: 380px;
            border-radius: 20px;
            transition: transform 0.8s;
            transform-style: preserve-3d;
            position: relative;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }

          .therapist-card:hover {
            transform: rotateY(180deg);
          }

          .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 20px;
            backface-visibility: hidden;
          }

          .card-front {
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
          }

          .card-front img {
            width: 100%;
            height: 180px;
            border-radius: 20px;
            object-fit: cover;
            margin-bottom: 15px;
          }

          .card-front h3 {
            margin-bottom: 4px;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .card-front p {
            margin: 2px 0;
            font-size: 0.95rem;
            color: #4b5563;
          }
          .card-back {
            background: linear-gradient(120deg, #3b82f6, #06b6d4);
            color: white;
            transform: rotateY(180deg);
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }

          .card-back h4 {
            margin-bottom: 10px;
          }

          .contact-button {
            margin-top: 12px;
            padding: 10px 18px;
            background: #06b6d4;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 500;
            color: white;
            transition: all 0.3s;
          }

          .contact-button:hover {
            background: #1e40af;
          }

          /* Why Therapists Section */
          .benefits-section {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .benefit-card {
            background: linear-gradient(135deg, #dbeafe, #f0fdfa);
            padding: 18px 25px;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
          }

          .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .benefit-card h4 {
            margin: 0;
            font-size: 1.1rem;
          }

          .benefit-card p {
            margin-top: 8px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease;
          }

          .benefit-card.expanded p {
            max-height: 120px;
          }

          /* Testimonials Section */
          .testimonials {
            text-align: center;
          }

          .testimonial-card {
            background: #fef9ff;
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            max-width: 600px;
            margin: 0 auto;
            position: relative;
          }

          .testimonial-card p {
            font-style: italic;
            margin-bottom: 12px;
          }

          .testimonial-card h4 {
            font-weight: 600;
            color: #1e3a8a;
          }

          .testimonial-buttons {
            margin-top: 15px;
            display: flex;
            justify-content: center;
            gap: 20px;
          }

          .testimonial-buttons button {
            background: #3b82f6;
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
          }

          .testimonial-buttons button:hover {
            background: #1e40af;
          }

          /* Newsletter Section */
          .newsletter {
            background: linear-gradient(120deg, #06b6d4, #3b82f6);
            color: white;
            padding: 40px 20px;
            border-radius: 20px;
            text-align: center;
          }

          .newsletter input {
            padding: 12px 18px;
            border-radius: 50px;
            border: none;
            outline: none;
            width: 60%;
            max-width: 400px;
            margin-right: 10px;
            font-size: 1rem;
          }

          .newsletter button {
            padding: 12px 25px;
            border-radius: 50px;
            border: none;
            background: white;
            color: #3b82f6;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .newsletter button:hover {
            background: #e0f2fe;
          }

          @media (max-width: 700px) {
            .therapist-list { justify-content: center; }
            .newsletter input { width: 100%; margin-bottom: 10px; }
            .newsletter button { width: 100%; }
          }
        `}</style>

        {/* ✅ Your existing code continues below, unchanged */}
        <div className="mega-card">
          <div className="hero">
            <h1>Find a Therapist Near You 🌿</h1>
            <p>Take the first step toward mental wellness and self-care.</p>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by name, specialty, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="therapist-list">
            {filteredTherapists.length > 0 ? filteredTherapists.map((t, i) => (
              <div className="card-container" key={i}>
                <div className="therapist-card">
                  <div className="card-front">
                    <img src={t.image} alt={t.name} />
                    <h3>{t.name}</h3>
                    <p><strong>{t.specialty}</strong></p>
                    <p>{t.degree}</p>
                    <p>{t.experience} experience</p>
                    <p>{t.location}</p>
                  </div>
                  <div className="card-back">
                    <h4>About</h4>
                    <p>{t.about}</p>
                    <button className="contact-button" onClick={() => window.location=`mailto:${t.contact}`}>Contact</button>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: "center", color: "#555" }}>No therapists found. Try another search.</p>
            )}
          </div>

          <div className="benefits-section">
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`benefit-card ${expandedBenefit === i ? "expanded" : ""}`}
                onClick={() => setExpandedBenefit(expandedBenefit === i ? null : i)}
              >
                <h4>{b.title}</h4>
                <p>{b.description}</p>
              </div>
            ))}
          </div>

          <div className="testimonials">
            <h2>What People Say About Therapy 💬</h2>
            <div className="testimonial-card">
              <p>"{testimonials[testimonialIndex].text}"</p>
              <h4>- {testimonials[testimonialIndex].name}</h4>
            </div>
            <div className="testimonial-buttons">
              <button onClick={prevTestimonial}>‹</button>
              <button onClick={nextTestimonial}>›</button>
            </div>
          </div>

          <div className="newsletter">
            <h2>Subscribe for Mental Health Tips 📰</h2>
            <p>Get weekly articles, self-care tips, and updates straight to your inbox.</p>
            <div>
              <input type="email" placeholder="Enter your email..." />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default FindTherapist;
