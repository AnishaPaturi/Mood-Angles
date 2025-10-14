import React from 'react';

const AnxietyTest = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Anxiety Test</h1>
      <p className="text-gray-600 text-center">
        This is a placeholder for the Anxiety Test page.
        <br />
        The test questions and logic will be added here later.
      </p>
      {/* Optional: Add a button to navigate back to the test page list */}
      <a 
        href="/TestPage" 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Test Page
      </a>
    </div>
  );
};

export default AnxietyTest;
