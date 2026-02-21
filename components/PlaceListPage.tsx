"use client";

import { useState, useMemo, useEffect } from "react";
import type { PlaceData } from "@/types/kakao";
import { regions as areas, categories, getCategoryEmoji } from "@/data/constants";

interface PlaceListPageProps {
  places: PlaceData[];
  onPlaceClick: (place: PlaceData) => void;
  initialSearch?: string;
}

export default function PlaceListPage({ places, onPlaceClick, initialSearch }: PlaceListPageProps) {
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedArea, setSelectedArea] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isOnlyFav, setIsOnlyFav] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hungry-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  useEffect(() => {
    if (initialSearch !== undefined) setSearch(initialSearch);
  }, [initialSearch]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("hungry-favorites", JSON.stringify(newFavs));
  };

  const filtered = useMemo(() => {
    return places.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || 
                            p.category.toLowerCase().includes(q) || 
                            p.tags?.some(t => t.toLowerCase().includes(q));
      const matchesArea = selectedArea === "전체" || p.area === selectedArea;
      const matchesCategory = selectedCategory === "전체" || p.category === selectedCategory;
      const matchesFav = !isOnlyFav || favorites.includes(p.id);
      
      return matchesSearch && matchesArea && matchesCategory && matchesFav;
    });
  }, [places, search, selectedArea, selectedCategory, favorites, isOnlyFav]);

  const BRAND = "#E8513D";
  const BRAND2 = "#F97316";

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F4F2] scrollbar-hide">
      {/* 헤더 필터 영역 */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#EEEBE6] shadow-sm">
        <div className="max-w-[600px] mx-auto px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-gray-900">
              🍽️ <span style={{ color: BRAND }}>맛집</span> 목록
            </h1>
            <button
              onClick={() => setIsOnlyFav(!isOnlyFav)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                isOnlyFav ? "bg-red-50 border-red-200 text-[#E8513D]" : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {isOnlyFav ? "❤️ 즐겨찾기" : "🤍 즐겨찾기"}
            </button>
          </div>

          {/* 검색창 */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="맛집 이름, 카테고리, 태그 검색"
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#E8513D]/20 outline-none"
            />
          </div>

          {/* 필터 가로 스크롤 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-1">
            {areas.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedArea(r)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all border-none cursor-pointer ${
                  selectedArea === r 
                    ? "bg-gradient-to-br from-[#E8513D] to-[#F97316] text-white shadow-sm shadow-orange-100" 
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  selectedCategory === c ? "bg-[#FFF5F3] border-[#E8513D] text-[#E8513D]" : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-3">
        <div className="text-[11px] text-gray-400 mb-3 px-1">
          총 <strong className="text-gray-900">{filtered.length}</strong>개
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🍽️</div>
            <p className="font-bold text-gray-700 text-lg">검색 결과가 없어요</p>
            <p className="text-xs text-gray-400 mt-2">다른 필터나 검색어를 사용해보세요</p>
            <button
              onClick={() => { setSearch(""); setSelectedArea("전체"); setSelectedCategory("전체"); setIsOnlyFav(false); }}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-[#E8513D] to-[#F97316] text-white text-xs font-black rounded-full shadow-xl shadow-orange-100 active:scale-95 transition-transform"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-20">
            {filtered.map((place) => (
              <div
                key={place.id}
                onClick={() => onPlaceClick(place)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] group cursor-pointer border border-gray-50"
              >
                {/* 카드 이미지 */}
                <div className="relative h-[115px] overflow-hidden">
                  <img
                    src={place.images?.[0] || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-2 left-2 text-[9px] font-black text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                    {place.category}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(e, place.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-xs shadow-md border-none transition-transform active:scale-125"
                  >
                    {favorites.includes(place.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* 카드 정보 */}
                <div className="p-3">
                  <h3 className="text-[12px] font-black text-gray-900 truncate mb-1 group-hover:text-[#E8513D] transition-colors">{place.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-[10px]">★</span>
                    <span className="text-[10px] font-black text-gray-900">{place.rating?.toFixed(1)}</span>
                    <span className="text-[9px] text-gray-300">({place.reviewCount})</span>
                    <span className="ml-auto text-[9px] text-gray-400">📍{place.area}</span>
                  </div>
                  <div className="flex gap-1 overflow-hidden">
                    {place.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-[#FFF5F3] text-[#E8513D] font-bold border border-[#E8513D]/10 whitespace-nowrap">
                        #{t}
                      </span>
                    ))}
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
