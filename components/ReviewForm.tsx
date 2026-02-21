"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

interface ReviewFormProps {
  restaurantId: number;
  onSubmit: (rating: number, content: string) => Promise<void>;
}

export default function ReviewForm({
  restaurantId,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (content.trim() === "") {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, content);
      setRating(0);
      setContent("");
    } catch (error) {
      console.error("Review submission failed:", error);
      alert("리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100/50 mb-3"
    >
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-semibold text-gray-700">리뷰 작성하기</h5>
        <StarRating rating={rating} onRatingChange={setRating} isInteractive />
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="이 맛집에 대한 경험을 공유해주세요!"
        className="w-full h-20 p-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? "등록 중..." : "리뷰 등록"}
        </button>
      </div>
    </form>
  );
}
