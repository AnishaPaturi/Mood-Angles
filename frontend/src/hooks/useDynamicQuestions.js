import { useState, useEffect } from "react";

const API_BASE = (import.meta.env.DEV ? import.meta.env.VITE_LOCAL_BACKEND : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

export default function useDynamicQuestions(category, defaultQuestions = []) {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(null));
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        
        let attemptNum = 1;
        if (userId) {
          try {
            const countRes = await fetch(`${API_BASE}/api/questions/${category}/attempt-count?userId=${userId}`);
            if (countRes.ok) {
              const countData = await countRes.json();
              attemptNum = countData.nextAttempt || 1;
            }
          } catch (e) {
            console.warn("Could not fetch attempt count:", e.message);
          }
        }
        
        setAttempt(attemptNum);
        
        const res = await fetch(`${API_BASE}/api/questions/${category}?dynamic=true&attempt=${attemptNum}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
            setAnswers(Array(data.questions.length).fill(null));
          }
        }
      } catch (e) {
        console.warn("Using default questions:", e.message);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (qIndex, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = value;
      return updated;
    });
  };

  return { questions, answers, handleSelect, attempt };
}