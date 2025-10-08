import React from "react";
import UserWrapper from "../components/UserWrapper";

function TherapistF() {
  return (
    <UserWrapper>
      <div className="p-8 text-center">
        <h1 className="text-3xl font-semibold mb-4 text-indigo-600">
          🧠 Find a Therapist
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with licensed therapists who can help you manage stress, anxiety,
          and emotional well-being. Browse professionals, view their specializations,
          and book a session that suits your schedule.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="w-full max-w-md p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-medium mb-2 text-gray-800">
              Coming Soon
            </h2>
            <p className="text-gray-500">
              The therapist directory and booking feature will be available soon.
            </p>
          </div>

          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Explore Therapists
          </button>
        </div>
      </div>
    </UserWrapper>
  );
}

export default TherapistF;
