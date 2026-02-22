// This is a placeholder for your API functions.
// The user will provide the actual URL later.

interface User {
  id: string;
  name: string;
  email: string;
}

export async function login(): Promise<User> {
  // Replace with your actual API endpoint and logic
  console.log("Attempting to log in...");
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };
      console.log("Logged in successfully:", mockUser);
      resolve(mockUser);
    }, 1000);
  });
}

export async function logout(): Promise<void> {
  // Replace with your actual API endpoint and logic
  console.log("Logging out...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Logged out successfully.");
      resolve();
    }, 500);
  });
}
