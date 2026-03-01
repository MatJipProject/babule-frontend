// src/lib/restaurantApi.ts

interface RestaurantData {
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  description?: string;
}

interface ReviewData {
  rating?: number;
  content?: string;
}

export async function addRestaurantWithReview(
  restaurantData: RestaurantData,
  reviewData: ReviewData | undefined,
  files: File[]
): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const formData = new FormData();

  // Append request_data as a JSON string
  const requestData = {
    ...restaurantData,
    review: reviewData,
  };
  formData.append("request_data", JSON.stringify(requestData));

  // Append files
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(
    "https://api.baebulook.site/api/v1/reviews/register",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data' is automatically set by fetch when using FormData
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "맛집 및 리뷰 등록에 실패했습니다.");
  }

  return response.json();
}
