/* eslint-disable no-undef */
// utils/session.js
import { createCookieSessionStorage } from "@remix-run/node"; // Adjust this import if necessary

// Create cookie session storage with default settings
const sessionSecret = process.env.SESSION_SECRET || "my-secret-key"; // Use a real secret in production

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "my_session", // Name of the cookie
    secure: process.env.NODE_ENV === "production", // Ensure it's secure in production
    secrets: [sessionSecret], // Secret to sign the cookie
    sameSite: "lax", // Helps prevent CSRF attacks
    path: "/", // Cookie is valid for all routes
    maxAge: 60 * 60 * 24 * 7, // 1 week expiration
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
});

// Utility function to get the user ID from the session
export async function getUserFromSession(request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userId");
}

// Utility function to set the user ID in the session
export async function setUserInSession(session, userId) {
  session.set("userId", userId);
  return {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

// Utility function to destroy the session (for logout)
export async function destroyUserSession(request) {
  const session = await getSession(request.headers.get("Cookie"));
  return {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  };
}

// Export getSession, commitSession, and destroySession for use in actions
export { getSession, commitSession, destroySession };
