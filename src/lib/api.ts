// This is a placeholder for your API functions.
// The user will provide the actual URL later.

interface User {
  id: string;
  name: string;
  email: string;
}

const API_BASE_URL = "https://api.baebulook.site";

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

// 리뷰 등록
export async function postReview(restaurantId: string, review: {
  rating: number;
  content: string;
}, files?: File[]): Promise<any> {
  const formData = new FormData();
  formData.append('restaurant_id', restaurantId);
  formData.append('rating', review.rating.toString());
  formData.append('content', review.content);
  
  if (files) {
    files.forEach(file => formData.append('files', file));
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/reviews`, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("postReview Error:", errorData);
    
    // 🌟 백엔드에서 보낸 detail 메시지(24시간 제한 등)를 최우선으로 잡아서 던집니다.
    const errorMessage = typeof errorData.detail === 'string' 
      ? errorData.detail 
      : errorData.message || '리뷰 등록에 실패했습니다.';
      
    throw new Error(errorMessage);
  }
  
  return res.json();
}