"use client";

import { useState, useMemo } from "react";
import type { PlaceData } from "@/types/kakao";

const categoryEmojis: Record<string, string> = {
  "오마카세": "🍣",
  "한식": "🍖",
  "양식": "🍝",
  "일식": "🍱",
  "카페": "☕",
};

const areas = ["전체", "구로", "강남", "합정", "한남", "이태원", "성수", "을지로", "서초", "신사", "청담", "용산"];
const categories = ["전체", "한식", "양식", "일식", "오마카세", "카페"];

type SortKey = "rating" | "reviewCount" | "name";

interface PlaceListPageProps {
  places: PlaceData[];
  onPlaceClick: (place: PlaceData) => void;
}

export default function PlaceListPage({ places, onPlaceClick }: PlaceListPageProps) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let result = [...places];

    // 검색
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // 지역
    if (selectedArea !== "전체") {
      result = result.filter((p) => p.area === selectedArea);
    }

    // 카테고리
    if (selectedCategory !== "전체") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviewCount") return (b.reviewCount || 0) - (a.reviewCount || 0);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [places, search, selectedArea, selectedCategory, sortBy]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">맛집 목록</h2>
          <p className="text-sm text-gray-500">총 {filtered.length}곳의 맛집</p>
        </div>

        {/* 검색 */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="맛집 이름, 카테고리, 태그 검색"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#E8513D] focus:ring-1 focus:ring-[#E8513D]/20 transition-colors"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 필터 + 정렬 */}
        <div className="flex flex-col gap-3 mb-5">
          {/* 지역 필터 */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedArea === area
                    ? "bg-[#E8513D] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* 카테고리 + 정렬 */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="shrink-0 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 focus:outline-none"
            >
              <option value="rating">별점순</option>
              <option value="reviewCount">리뷰순</option>
              <option value="name">이름순</option>
            </select>
          </div>
        </div>

        {/* 목록 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((place) => (
              <div
                key={place.id}
                onClick={() => onPlaceClick(place)}
                className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3.5">
                  {/* 이모지 썸네일 */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-50 transition-colors">
                    <span className="text-2xl md:text-3xl">
                      {categoryEmojis[place.category] || "🍽️"}
                    </span>
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm md:text-base font-bold text-gray-900 truncate group-hover:text-[#E8513D] transition-colors">
                        {place.name}
                      </h3>
                      {place.isHot && (
                        <span className="shrink-0 text-[10px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded">
                          HOT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-gray-500">{place.category}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{place.area}</span>
                      {place.priceRange && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">{place.priceRange}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                      {place.review}
                    </p>

                    {/* 태그 */}
                    {place.tags && place.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {place.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 별점 & 리뷰 */}
                  <div className="text-right shrink-0">
                    {place.rating && (
                      <div className="flex items-center gap-1 justify-end mb-0.5">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-sm font-bold text-gray-800">{place.rating}</span>
                      </div>
                    )}
                    {place.reviewCount != null && (
                      <p className="text-[11px] text-gray-400">
                        리뷰 {place.reviewCount.toLocaleString()}
                      </p>
                    )}
                    {place.openHours && (
                      <p className="text-[10px] text-gray-400 mt-1">{place.openHours}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
