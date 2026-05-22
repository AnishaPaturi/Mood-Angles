import { useState, useEffect } from "react";

const API_BASE = (import.meta.env.DEV ? import.meta.env.VITE_LOCAL_BACKEND : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

export default function useDynamicQuestions(category, defaultQuestions = []) {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(null));

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/questions/${category}?dynamic=true`);
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

  return { questions, answers, handleSelect };
}