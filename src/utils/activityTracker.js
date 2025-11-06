// src/utils/activityTracker.js
// LocalStorage-backed activity tracker (dynamic + persistent)

const DEFAULT = {
  timeSpent: 0, // minutes
  testsTaken: 0,
  moodLogs: 0,
  streak: 0,
  lastLoginDate: null,
};

// Helper to safely read from storage
function read() {
  try {
    const raw = localStorage.getItem("moodangels_activity");
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed };
  } catch (e) {
    console.error("activityTracker read error", e);
    return { ...DEFAULT };
  }
}

// Helper to safely write to storage
function write(obj) {
  try {
    localStorage.setItem("moodangels_activity", JSON.stringify(obj));
  } catch (e) {
    console.error("activityTracker write error", e);
  }
}

/**
 * updateActivity()
 * Keys:
 * - "testTaken"   → increments testsTaken
 * - "moodLogged"  → increments moodLogs
 * - "sessionTime" → adds minutes (payload.minutes optional)
 * - "login"       → updates streak + lastLoginDate
 * - "reset"       → resets all stats
 */
export function updateActivity(key, payload = {}) {
  const data = read();

  switch (key) {
    case "testTaken":
      data.testsTaken = (data.testsTaken || 0) + 1;
      break;

    case "moodLogged":
      data.moodLogs = (data.moodLogs || 0) + 1;
      break;

    case "sessionTime":
      data.timeSpent = (data.timeSpent || 0) + (payload.minutes ?? 1);
      break;

    case "login": {
      const today = new Date().toISOString().slice(0, 10);
      if (data.lastLoginDate !== today) {
        // increment streak if consecutive login
        const last = data.lastLoginDate;
        if (last) {
          const lastDate = new Date(last);
          const diff =
            (new Date(today) - new Date(lastDate.toISOString().slice(0, 10))) /
            (1000 * 60 * 60 * 24);
          // if last day was yesterday, continue streak
          if (diff > 1) data.streak = 1;
        }
        data.streak = (data.streak || 0) + 1;
        data.lastLoginDate = today;
      }
      break;
    }

    case "reset":
      write({ ...DEFAULT });
      return DEFAULT;

    default:
      break;
  }

  write(data);
  return data;
}

/**
 * getActivity()
 * Reads and formats user activity data for UI (used in Settings.jsx)
 */
export function getActivity() {
  const raw = read();
  return {
    timeSpent: `${raw.timeSpent ?? 0} mins today`,
    testsTaken: raw.testsTaken ?? 0,
    moodLogs: raw.moodLogs ?? 0,
    streak: raw.streak ?? 0,
    raw,
  };
}
