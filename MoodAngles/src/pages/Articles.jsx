import React from "react";
import UserWrapper from "../components/UserWrapper";

function Articles() {
  return (
    <UserWrapper>
      <h1 className="text-2xl font-semibold mb-4">📚 Articles & Resources</h1>
      <p className="text-gray-700 mb-3">
        Discover insightful articles on mental health, mindfulness, and
        emotional well-being curated by our experts.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">🧘 The Power of Mindfulness</h3>
          <p className="text-sm text-gray-600 mt-2">
            Learn how mindfulness can help reduce stress and improve focus.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">🌙 Better Sleep Habits</h3>
          <p className="text-sm text-gray-600 mt-2">
            Simple strategies to improve your sleep cycle and mental clarity.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">💬 Talking About Emotions</h3>
          <p className="text-sm text-gray-600 mt-2">
            How open communication can strengthen emotional resilience.
          </p>
        </div>
      </div>
    </UserWrapper>
  );
}

export default Articles;
