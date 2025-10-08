import React from "react";
import UserWrapper from "../components/UserWrapper";

function Help() {
  return (
    <UserWrapper>
      <h1 className="text-2xl font-semibold mb-4">🆘 Help & FAQs</h1>
      <p className="text-gray-700 mb-2">
        Welcome to the Help Center! Here you’ll find answers to common
        questions and guidance on using MoodAngels effectively.
      </p>
      <ul className="list-disc ml-6 mt-3 text-gray-600">
        <li>How to take a mood test</li>
        <li>Understanding your results</li>
        <li>Contacting a professional</li>
        <li>Managing your profile and settings</li>
      </ul>
    </UserWrapper>
  );
}

export default Help;
