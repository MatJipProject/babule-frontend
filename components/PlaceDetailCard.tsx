'use client';

import { useState } from 'react';
import type { PlaceData } from '@/types/kakao';

interface PlaceDetailCardProps {
  place: PlaceData;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xs ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function PlaceDetailCard({ place, onClose }: PlaceDetailCardProps) {
  const [liked, setLiked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews = place.reviews || [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <>
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0 z-40" onClick={onClose} />

      {/* 플로팅 팝업 카드 */}
      <div className="absolute left-0 right-0 bottom-0 h-[65vh] md:left-auto md:right-4 md:top-4 md:bottom-4 md:h-auto md:w-[360px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl z-50 animate-slide-up md:animate-popup-in overflow-y-auto">
        {/* 모바일 드래그 핸들 */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 카테고리 + 태그 + 하트 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block px-2.5 py-1 bg-red-50 text-[#E8513D] text-xs font-semibold rounded-md">
              {place.category}
            </span>
            {place.priceRange && (
              <span className="text-xs text-gray-400 font-medium">{place.priceRange}</span>
            )}
            {place.isHot && (
              <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-500 text-[10px] font-bold rounded">HOT</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="w-8 h-8 flex items-center justify-center"
            aria-label="좋아요"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={liked ? '#E8513D' : 'none'}
              stroke={liked ? '#E8513D' : '#d1d5db'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* 가게명 */}
        <div className="px-5 pb-1">
          <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
          {place.description && (
            <p className="text-xs text-gray-400 mt-0.5">{place.description}</p>
          )}
        </div>

        {/* 별점 종합 */}
        {place.rating && (
          <div className="px-5 py-2 flex items-center gap-2">
            <StarRating rating={Math.round(place.rating)} />
            <span className="text-sm text-gray-800 font-bold">{place.rating}</span>
            {place.reviewCount && (
              <span className="text-xs text-gray-400">리뷰 {place.reviewCount.toLocaleString()}개</span>
            )}
          </div>
        )}

        {/* 정보 */}
        <div className="px-5 pb-3 space-y-1.5">
          {place.address && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-xs mt-0.5 shrink-0">주소</span>
              <p className="text-sm text-gray-600">{place.address}</p>
            </div>
          )}
          {place.openHours && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-xs mt-0.5 shrink-0">영업</span>
              <p className="text-sm text-gray-600">{place.openHours}</p>
            </div>
          )}
          {place.phone && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-xs mt-0.5 shrink-0">전화</span>
              <p className="text-sm text-gray-600">{place.phone}</p>
            </div>
          )}
        </div>

        {/* 태그 */}
        {place.tags && place.tags.length > 0 && (
          <div className="px-5 pb-3 flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 구분선 */}
        <div className="mx-5 border-t border-gray-100" />

        {/* 리뷰 목록 */}
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-800">
              리뷰 {reviews.length > 0 ? `(${reviews.length})` : ''}
            </h4>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {visibleReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{review.author}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="text-[10px] text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                  {review.helpful != null && review.helpful > 0 && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="text-[10px] text-gray-400">도움이 됐어요 {review.helpful}</span>
                    </div>
                  )}
                </div>
              ))}

              {reviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2 border border-gray-200 rounded-lg transition-colors"
                >
                  {showAllReviews ? '접기' : `리뷰 ${reviews.length - 2}개 더보기`}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">아직 리뷰가 없어요</p>
          )}
        </div>

        {/* 카카오맵 링크 */}
        {place.link && (
          <div className="px-5 pb-5 pt-2">
            <a
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-medium text-white bg-[#E8513D] hover:bg-[#d4462f] py-2.5 rounded-xl transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              카카오맵에서 보기
            </a>
          </div>
        )}
      </div>
    </>
  );
}
