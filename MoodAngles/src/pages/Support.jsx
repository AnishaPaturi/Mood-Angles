import React from "react";
import UserWrapper from "../components/UserWrapper";

function Support() {
  return (
    <UserWrapper>
      <h1 className="text-2xl font-semibold mb-4">💬 Support</h1>
      <p className="text-gray-700 mb-3">
        Need help or want to talk? Our support team is here for you 24/7.
      </p>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
        <form className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Your Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              rows="4"
              placeholder="Describe your issue..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </UserWrapper>
  );
}

export default Support;
