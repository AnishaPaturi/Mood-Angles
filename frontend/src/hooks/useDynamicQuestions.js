import { useState, useEffect } from "react";

const API_BASE = (import.meta.env.DEV ? import.meta.env.VITE_LOCAL_BACKEND : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

export default function useDynamicQuestions(category, defaultQuestions = []) {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(null));
  const [attempt, setAttempt] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        
        let attemptNum = 1;
        let prevQuestions = [];
        
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
          
          // Fetch previous questions from past results
          if (attemptNum > 1) {
            try {
              const testRes = await fetch(`${API_BASE}/api/results/previous/${category}?userId=${userId}`);
              if (testRes.ok) {
                const testData = await testRes.json();
                if (testData.previousResults) {
                  // Extract questions from previous results
                  testData.previousResults.forEach(result => {
                    if (result.answers) {
                      Object.values(result.answers).forEach(ans => {
                        if (typeof ans === 'string' && ans.includes('→')) {
                          const qText = ans.split('→')[0].trim();
                          if (qText && !prevQuestions.includes(qText)) {
                            prevQuestions.push(qText);
                          }
                        }
                      });
                    }
                  });
                }
              }
            } catch (e) {
              console.warn("Could not fetch previous questions:", e.message);
            }
          }
        }
        
        setAttempt(attemptNum);
        
        const params = new URLSearchParams({
          dynamic: "true",
          attempt: attemptNum
        });
        
        if (attemptNum > 1 && prevQuestions.length > 0) {
          params.append("previousQuestions", JSON.stringify(prevQuestions));
        }
        
        const res = await fetch(`${API_BASE}/api/questions/${category}?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
            setAnswers(Array(data.questions.length).fill(null));
          }
        }
      } catch (e) {
        console.warn("Using default questions:", e.message);
      } finally {
        setLoading(false);
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

  return { questions, answers, handleSelect, attempt, loading };
}