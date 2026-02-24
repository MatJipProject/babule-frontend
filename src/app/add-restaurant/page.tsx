"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import * as restaurantApi from "@/lib/restaurantApi"; // Will create this next

const categories = [
  "한식", "중식", "일식", "양식", "분식", "아시안", "카페", "술집", "기타"
];

export default function AddRestaurantPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [reviewContent, setReviewContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const validateForm = () => {
    if (!restaurantName.trim()) return "맛집 이름을 입력해주세요.";
    if (!category.trim()) return "카테고리를 선택해주세요.";
    if (!address.trim()) return "주소를 입력해주세요.";
    if (!latitude || isNaN(parseFloat(latitude))) return "올바른 위도를 입력해주세요.";
    if (!longitude || isNaN(parseFloat(longitude))) return "올바른 경도를 입력해주세요.";
    if (rating && (rating < 1 || rating > 5)) return "별점은 1에서 5 사이여야 합니다.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("로그인 후 이용해주세요.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const restaurantData = {
        name: restaurantName,
        category,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        phoneNumber: phoneNumber || undefined,
        description: description || undefined,
      };

      const reviewData = (rating !== undefined || reviewContent.trim())
        ? {
            rating: rating || undefined,
            content: reviewContent || undefined,
          }
        : undefined;

      await restaurantApi.addRestaurantWithReview(
        restaurantData,
        reviewData,
        photos
      );

      alert("맛집과 리뷰가 성공적으로 등록되었습니다!");
      router.push("/"); // Redirect to home or restaurant list page
    } catch (err: any) {
      console.error("Failed to add restaurant:", err);
      setError(err.message || "맛집 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">맛집 추가</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Restaurant Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">맛집 정보</h2>
          <div>
            <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
              맛집 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="restaurantName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                위도 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="latitude"
                step="any"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                경도 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitude"
                step="any"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
              type="text"
              id="phoneNumber"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
              사진
            </label>
            <input
              type="file"
              id="photos"
              multiple
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#E8513D]/10 file:text-[#E8513D]
                hover:file:bg-[#E8513D]/20"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {photos.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                선택된 파일: {photos.map(file => file.name).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Review Details (Optional) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">리뷰 정보 (선택)</h2>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              별점 (1-5)
            </label>
            <input
              type="number"
              id="rating"
              min="1"
              max="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={rating === undefined ? "" : rating}
              onChange={(e) => setRating(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700">
              리뷰 내용
            </label>
            <textarea
              id="reviewContent"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E8513D] focus:border-[#E8513D]"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">에러: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-[#E8513D] hover:bg-[#d9402c] text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "등록 중..." : "맛집 등록"}
        </button>
      </form>
    </div>
  );
}
