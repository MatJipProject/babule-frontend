"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/hooks/useAuth";
import { createRestaurantAndReview } from "@/utils/api";
import type { RestaurantReviewCreate } from "@/types/api";

const categories = [
  "한식",
  "중식",
  "일식",
  "양식",
  "카페",
  "술집",
  "기타",
];

export default function AddRestaurantPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [address, setAddress] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placeUrl, setPlaceUrl] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoggedIn) {
    // Optionally redirect to login page or show a message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-gray-700 mb-4">
          맛집을 추가하려면 로그인해야 합니다.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          로그인
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !address || !latitude || !longitude || rating === 0 || !content) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const restaurantReviewData: RestaurantReviewCreate = {
      name,
      category,
      address,
      road_address: roadAddress || undefined,
      phone: phone || undefined,
      place_url: placeUrl || undefined,
      description: description || undefined,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      rating,
      content,
    };

    try {
      await createRestaurantAndReview(restaurantReviewData, files);
      alert("맛집과 리뷰가 성공적으로 등록되었습니다!");
      router.push("/"); // Redirect to home page or new restaurant's detail page
    } catch (error) {
      console.error("Failed to add restaurant and review:", error);
      alert("맛집과 리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          새로운 맛집 등록
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Details */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              맛집 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="roadAddress"
              className="block text-sm font-medium text-gray-700"
            >
              도로명 주소 (선택)
            </label>
            <input
              type="text"
              id="roadAddress"
              value={roadAddress}
              onChange={(e) => setRoadAddress(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              전화번호 (선택)
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="placeUrl"
              className="block text-sm font-medium text-gray-700"
            >
              장소 URL (선택)
            </label>
            <input
              type="url"
              id="placeUrl"
              value={placeUrl}
              onChange={(e) => setPlaceUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              설명 (선택)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                위도 (Latitude) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="latitude"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                경도 (Longitude) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitude"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          {/* Review Details */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              첫 번째 리뷰 작성
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                별점 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <StarRating rating={rating} onRatingChange={setRating} isInteractive />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                리뷰 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="files"
                className="block text-sm font-medium text-gray-700"
              >
                사진 추가 (선택)
              </label>
              <input
                type="file"
                id="files"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? "등록 중..." : "맛집 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
